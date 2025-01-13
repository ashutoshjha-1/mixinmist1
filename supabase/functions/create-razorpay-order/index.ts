import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import Razorpay from "https://esm.sh/razorpay@2.9.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Unauthorized')
    }

    console.log('Authenticated user:', user.email)

    // Initialize Razorpay
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    console.log('Creating subscription for user:', user.email)

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expireTimestamp = currentTimestamp + 1800; // 30 minutes from now

    try {
      const subscription = await razorpay.subscriptions.create({
        plan_id: 'plan_PiWVhnhwqnvGms',
        total_count: 6,
        quantity: 1,
        customer_notify: 1,
        start_at: currentTimestamp,
        expire_by: expireTimestamp,
        offer_id: 'offer_PiYlFyG1gAU0nr',
        addons: [
          {
            item: {
              name: "Subscription Fee",
              amount: 1000, // 10 INR in paise
              currency: "INR"
            }
          }
        ],
        notes: {
          user_id: user.id,
          user_email: user.email
        }
      });

      console.log('Subscription created:', subscription)

      return new Response(
        JSON.stringify({ subscription }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (razorpayError: any) {
      console.error('Razorpay API error:', razorpayError)
      return new Response(
        JSON.stringify({
          error: {
            code: razorpayError.error?.code || "BAD_REQUEST_ERROR",
            description: razorpayError.error?.description || razorpayError.message,
            source: razorpayError.error?.source || "NA",
            step: razorpayError.error?.step || "NA",
            reason: razorpayError.error?.reason || "NA",
            metadata: razorpayError.error?.metadata || {}
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  } catch (error: any) {
    console.error('Error in create-razorpay-order:', error)
    
    return new Response(
      JSON.stringify({ 
        error: {
          code: "BAD_REQUEST_ERROR",
          description: error.message,
          source: "NA",
          step: "NA",
          reason: "NA",
          metadata: {}
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    )
  }
})