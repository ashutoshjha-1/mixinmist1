import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planId, totalCount, quantity, customerNotify, startAt, expireBy, offerId, addons, notes } = await req.json()

    console.log('Received request with startAt:', startAt);

    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`)}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: totalCount,
        quantity,
        customer_notify: customerNotify,
        start_at: startAt,
        expire_by: expireBy,
        offer_id: offerId,
        addons,
        notes,
      }),
    })

    const data = await response.json()
    console.log('Razorpay API response:', data);

    if (!response.ok) {
      throw new Error(data.error?.description || 'Failed to create subscription')
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message,
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})