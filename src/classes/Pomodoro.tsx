import { v4 as uuid4 } from 'uuid'

import { TS_SECOND } from '../utils/Const'

export enum PomodoroStatus {
  DONE = 'done',
  DISCARDED = 'discarded',
  IN_PROCESS = 'in process',
}
export interface AbstractPomodoro {
  id: string
  duration: number
  current: number
  remark: string
  status: PomodoroStatus

  start(
    currentChangeCallback: (current: number) => void,
    finishedCallback: () => void,
  ): void

  discard(): void
  discard(remark: string): void
}

export class Pomodoro implements AbstractPomodoro {
  /** unit: millisecond */
  protected _duration: number
  protected _current: number
  protected _remark: string
  protected _status: PomodoroStatus
  protected _intervalTimer: NodeJS.Timer
  protected _timeoutTimer: NodeJS.Timeout
  protected _id: string

  static singletonPomoInstance: AbstractPomodoro = null

  protected constructor(duration: number) {
    this._remark = ''
    this._current = 0
    this._duration = duration
    this._status = PomodoroStatus.IN_PROCESS
    this._id = uuid4()
  }

  get id() {
    return this._id
  }
  get duration() {
    return this._duration
  }
  get current() {
    return this._current
  }
  get remark() {
    return this._remark
  }
  get status() {
    return this._status
  }
  static getPomoInstance(duration: number): AbstractPomodoro {
    if (Pomodoro.singletonPomoInstance) {
      throw new Error('存在未结束的番茄，无法创建新番茄。')
    } else {
      Pomodoro.singletonPomoInstance = new Pomodoro(duration)
      return Pomodoro.singletonPomoInstance
    }
  }

  start(
    currentChangeCallback: (current: number) => void,
    finishedCallback: () => void,
  ) {
    this._timeoutTimer = setTimeout(() => {
      clearInterval(this._intervalTimer)
      this._intervalTimer = undefined

      this._status = PomodoroStatus.DONE
      Pomodoro.singletonPomoInstance = null

      finishedCallback()
    }, this._duration)

    this._intervalTimer = setInterval(() => {
      const current = this._current + TS_SECOND
      this._current = current
      currentChangeCallback(current)
    }, TS_SECOND)
  }

  discard(remark?: string) {
    clearInterval(this._intervalTimer)
    this._intervalTimer = undefined
    clearTimeout(this._timeoutTimer)
    this._timeoutTimer = undefined

    this._status = PomodoroStatus.DISCARDED
    Pomodoro.singletonPomoInstance = null

    if (remark && remark.length) {
      this._remark = remark
    }
  }
}
