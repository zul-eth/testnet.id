type Step = {
  label: string
}

export default function StepProgressBar({
  current,
  steps = [],
}: {
  current: number
  steps?: Step[]
}) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="flex flex-col items-center mb-5 w-full">
      {/* Circle dan Garis */}
      <div className="flex items-center justify-between w-full px-2">
        {steps.map((step, index) => {
          const isActive = current >= index + 1
          const isLast = index === steps.length - 1
          return (
            <div key={index} className="flex-1 flex items-center">
              {/* Nomor Bulat */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
              >
                {index + 1}
              </div>
              {/* Bar */}
              {!isLast && (
                <div className={`flex-1 h-1 mx-1 ${current > index + 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Label teks */}
      <div className="flex justify-between w-full text-[10px] text-gray-500 mt-1 px-2">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`w-1/3 text-center ${
              current === index + 1 ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  )
}