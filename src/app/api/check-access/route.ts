import { NextRequest, NextResponse } from 'next/server'
import { checkUserAccessByEmail, checkUserAccessByTransaction } from '@/lib/access-control'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, transactionId, type = 'email' } = body

    let accessStatus

    if (type === 'email' && email) {
      accessStatus = await checkUserAccessByEmail(email)
    } else if (type === 'transaction' && transactionId) {
      accessStatus = await checkUserAccessByTransaction(transactionId)
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email ou transaction ID é obrigatório'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      hasAccess: accessStatus.hasAccess,
      user: accessStatus.user,
      reason: accessStatus.reason
    })

  } catch (error) {
    console.error('Erro na verificação de acesso:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const transactionId = searchParams.get('transactionId')

  try {
    let accessStatus

    if (email) {
      accessStatus = await checkUserAccessByEmail(email)
    } else if (transactionId) {
      accessStatus = await checkUserAccessByTransaction(transactionId)
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email ou transaction ID é obrigatório'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      hasAccess: accessStatus.hasAccess,
      user: accessStatus.user,
      reason: accessStatus.reason
    })

  } catch (error) {
    console.error('Erro na verificação de acesso:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}