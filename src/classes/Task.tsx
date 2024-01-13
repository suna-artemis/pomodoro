import { AbstractPomodoro, Pomodoro } from './Pomodoro'

import { v4 as uuid4 } from 'uuid'

export enum TodoTaskStatus {
  TODO = 'todo',
  IN_PROCESS = 'in process',
  DONE = 'done',
}
export interface AbstractTodoTask {
  id: string
  /** 任务简介 */
  name: string
  /** 任务描述 */
  describe: string
  /** 任务是否已完成 */
  status: TodoTaskStatus
  /** 当前任务产生的番茄集合 */
  pomoList: AbstractPomodoro[]
}

export interface AbstractPromiseTask extends AbstractTodoTask {
  startPomo(
    duration: number,
    currentChangeCallback: (current: number) => void,
    finishedCallback: () => void,
  ): void
  discardPomo(): void
  finishTask(): void
}

export class TodoTask implements AbstractTodoTask {
  protected _id: string
  name: string
  describe: string
  protected _pomoList: AbstractPomodoro[]
  protected _status: TodoTaskStatus = TodoTaskStatus.TODO

  constructor(name: string, describe: string) {
    this._id = uuid4()
    this.name = name
    this.describe = describe
    this._pomoList = []
    this._status = TodoTaskStatus.TODO
  }
  get status(): TodoTaskStatus {
    return this._status
  }
  get pomoList(): AbstractPomodoro[] {
    return this._pomoList
  }
  get id(): string {
    return this._id
  }
}

export class PromiseTask extends TodoTask implements AbstractPromiseTask {
  private _inProcessPomo: AbstractPomodoro = null

  constructor(name: string, describe: string) {
    super(name, describe)
  }
  get runningPomo(): AbstractPomodoro {
    return this._inProcessPomo
  }

  endPomo() {
    this._pomoList.push(this._inProcessPomo)
    this._inProcessPomo = null
  }
  startPomo(
    duration: number,
    currentChangeCallback: (current: number) => void,
    finishedCallback: () => void,
  ) {
    this._status = TodoTaskStatus.IN_PROCESS
    this._inProcessPomo = Pomodoro.getPomoInstance(duration)
    this._inProcessPomo.start(currentChangeCallback, () => {
      this.endPomo()
      finishedCallback()
    })
  }
  discardPomo() {
    this._inProcessPomo.discard()
    this.endPomo()
  }
  finishTask() {
    this._status = TodoTaskStatus.DONE
  }
}
