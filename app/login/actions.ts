'use server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'

export async function loginUser(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectPath = formData.get('redirect') as string || '/'

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return { error: 'Invalid email or password.' }
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) {
      return { error: 'Invalid email or password.' }
    }

    // Set Session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name || undefined,
    })

    return { success: true, redirect: redirectPath }
  } catch (err) {
    console.error('Login action error:', err)
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function logoutUser() {
  const { deleteSession } = await import('@/lib/session')
  await deleteSession()
  return { success: true }
}
