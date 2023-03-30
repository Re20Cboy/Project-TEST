import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
// 在用户注册成功后创建一个名为"likes"的表，并将该用户的ID插入到该表中。请注意，这将在每次用户登录时都执行一次，因此如果该表已经存在，则不会创建新表。
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const { user } = session
    const { error } = await supabase
      .from('likes')
      .insert([{ user_id: user.id }])
    if (error) console.log('error', error)
  }
})
