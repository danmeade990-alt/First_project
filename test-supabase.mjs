import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing env vars — check .env.local')
  process.exit(1)
}

const supabase = createClient(url, key)

console.log('Connecting to Supabase...')

// Insert a test row
const { data: inserted, error: insertError } = await supabase
  .from('test_connection')
  .insert({ message: 'Hello from Claude Code!' })
  .select()

if (insertError) {
  console.error('Insert failed:', insertError.message)
  console.log('\nMake sure you ran the CREATE TABLE SQL in the Supabase Dashboard.')
  process.exit(1)
}

console.log('Row inserted:', inserted)

// Read it back
const { data: rows, error: selectError } = await supabase
  .from('test_connection')
  .select('*')

if (selectError) {
  console.error('Select failed:', selectError.message)
  process.exit(1)
}

console.log(`\nAll rows in test_connection (${rows.length} total):`)
rows.forEach(r => console.log(' -', r.id, '|', r.message, '|', r.created_at))

console.log('\nSupabase connection is working!')
