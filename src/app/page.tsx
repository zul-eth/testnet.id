'use client'

import { useState } from 'react'
import Step1_ExchangeForm from '@/components/steps/Step1_ExchangeForm'
import Step2_AddressForm from '@/components/steps/Step2_AddressForm'
import Step3_TransactionStatus from '@/components/steps/Step3_TransactionStatus'
import type { FormState } from '@/types/form'
import { getRate } from '@/utils/rates'
import { v4 as uuidv4 } from 'uuid'

const initialForm: FormState = {
  amount: '',
  currency: 'USDT',
  receiveCurrency: 'ETH',
  receiveAmount: '',
  address: '',
  txId: '',
}

export default function Page() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [step, setStep] = useState(1)

  const handleChange = (updated: FormState) => {
    const amountNum = parseFloat(updated.amount)
    const rate = getRate(updated.currency, updated.receiveCurrency)
    const estimated = !isNaN(amountNum) && rate
      ? (amountNum * rate).toFixed(6)
      : ''
    setForm({ ...updated, receiveAmount: estimated })
  }

  const handleNext = () => {
    if (step === 2) {
      // Generate txId ketika masuk ke Step 3
      const txId = uuidv4()
      setForm((prev) => ({ ...prev, txId }))
    }
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setStep((s) => s - 1)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {step === 1 && (
        <Step1_ExchangeForm
          data={form}
          onChange={handleChange}
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
      {step === 3 && <Step3_TransactionStatus data={form} />}
    </main>
  )
}
