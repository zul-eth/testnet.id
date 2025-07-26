'use client'

import { useState } from 'react'
import Step1_ExchangeForm from '@/components/steps/Step1_ExchangeForm'
import Step2_AddressForm from '@/components/steps/Step2_AddressForm'
import Step3_TransactionStatus from '@/components/steps/Step3_TransactionStatus'

interface FormState {
  amount: string
  baseCoinSymbol: string
  quoteCoinSymbol: string
  receiveAmount: string
  address: string
  network: 'TESTNET' | 'MAINNET'
  pairId?: string
  paymentRouteId?: string
  paymentAddress?: string
  protocol?: string
  orderId?: string
  orderHash?: string
}

const initialForm: FormState = {
  amount: '',
  baseCoinSymbol: '',
  quoteCoinSymbol: '',
  receiveAmount: '',
  address: '',
  network: 'TESTNET',
  paymentAddress: '',
  protocol: '',
}

export default function OrderPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [step, setStep] = useState<number>(1)

  const handleNext = () => {
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setStep(s => s - 1)
  }

  const handleReset = () => {
    setForm(initialForm)
    setStep(1)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {step === 1 && (
          <Step1_ExchangeForm
            data={form}
            onChange={setForm}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <Step2_AddressForm
            data={form}
            onChange={setForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <Step3_TransactionStatus
            data={form}
            onBack={handleBack}
            onCancel={handleReset}
          />
        )}
      </div>
    </main>
  )
}