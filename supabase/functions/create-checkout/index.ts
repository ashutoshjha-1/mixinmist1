import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "frame-ancestors *; frame-src *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';"
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting checkout process...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    console.log('Getting user from token...')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user?.email) {
      console.error('Auth error:', userError)
      throw new Error('Authentication failed')
    }

    console.log('User authenticated:', user.email)

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Check if customer already exists
    console.log('Checking for existing customer...')
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    const price_id = Deno.env.get('STRIPE_PRICE_ID') || "price_1Qecv9SC2t9RO3xgYVEs5JUv"

    let customer_id = undefined
    if (customers.data.length > 0) {
      customer_id = customers.data[0].id
      console.log('Found existing customer:', customer_id)
      
      // Check for active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer_id,
        status: 'active',
        price: price_id,
        limit: 1
      })

      if (subscriptions.data.length > 0) {
        console.log('Customer already has active subscription')
        throw new Error("Already subscribed")
      }
    }

    console.log('Creating checkout session...')
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : user.email,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/pricing?success=true`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      allow_promotion_codes: true,
    })

    console.log('Checkout session created:', session.id)
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in create-checkout:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error instanceof Error && error.message === 'Already subscribed' ? 400 : 500,
      }
    )
  }
})