import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the host from the request headers
    const host = req.headers.get('host')
    if (!host) {
      throw new Error('No host header found')
    }

    console.log('Resolving custom domain:', host)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Query store settings using maybeSingle() to handle no results gracefully
    const { data: storeSettings, error } = await supabase
      .from('store_settings')
      .select('user_id, store_name')
      .eq('custom_domain', host)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    if (!storeSettings) {
      console.log('No store found for domain:', host)
      return new Response(
        JSON.stringify({ error: 'Store not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Found store:', storeSettings)

    // Return the store information
    return new Response(
      JSON.stringify({
        storeName: storeSettings.store_name,
        userId: storeSettings.user_id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})