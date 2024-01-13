import { useEffect, useState } from 'react'
import { Pomodoro, PomodoroStatus } from '../classes/Pomodoro'
import { TS_MINUTE, TS_SECOND } from '../utils/Const'
import { PromiseTask, TodoTaskStatus } from '../classes/Task'

interface IndexProps {}

const Index = (props: IndexProps) => {
  const [ptMap, setPtMap] = useState<Map<string, PromiseTask>>(
    new Map<string, PromiseTask>([]),
  )
  const [runningPt, setRunningPt] = useState<PromiseTask | null>(null)
  const [current, setCurrent] = useState(0)

  const duration = 30 * TS_SECOND
  const currentChangeCallback = (current: number) => {
    setCurrent(current)
  }
  const finishedCallback = () => {
    setCurrent(0)
  }

  const createPt = () => {
    const pt = new PromiseTask(`name: noah`, `Desc: some desc`)
    setPtMap((pre) => {
      pre.set(pt.id, pt)
      return new Map([...pre])
    })
  }

  const startPomo = (ptId: string) => {
    // pt.startPomo(duration, finishedCallback)
    const runningPt = ptMap.get(ptId)
    console.log('runningPt', runningPt)
    try {
      runningPt.startPomo(duration, currentChangeCallback, finishedCallback)
    } catch (error) {
      console.log('开始另一个番茄之前请确保当前番茄已完成或已废弃!')
    }
    setRunningPt(runningPt)
  }
  const discard = (ptId: string) => {
    const runningPt = ptMap.get(ptId)
    runningPt.discardPomo()
    setCurrent(0)
    setRunningPt(null)
  }
  const ptList = [...ptMap.entries()]

  return (
    <div className='h-full p-6'>
      <div className='flex h-full border-2 rounded-xl border-[#f7f7f7]'>
        <aside className='hidden px-2 lg:w-1/4 lg:flex py-9 shadow-[1px_0px_1px_#ececec]'>
          <button onClick={createPt}>create a promise task</button>
        </aside>
        <main className='flex-1'>
          {ptList.map(([, pt]) => (
            <div key={pt.id} className='border'>
              <div>{pt.name}</div>
              <div>{pt.describe}</div>
              {!pt.runningPomo ? (
                <button className='border' onClick={() => startPomo(pt.id)}>
                  {'start'}
                </button>
              ) : pt.runningPomo &&
                pt.runningPomo.status === PomodoroStatus.IN_PROCESS ? (
                <div>
                  {runningPt && (
                    <button className='border'>{`current: ${
                      current / TS_SECOND
                    }`}</button>
                  )}
                  <button className='border' onClick={() => discard(pt.id)}>
                    {'discard'}
                  </button>
                </div>
              ) : (
                <div className='border' onClick={() => startPomo(pt.id)}>
                  start another pomo
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export default Index
