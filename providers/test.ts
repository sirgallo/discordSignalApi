import * as fs from 'fs'
import * as util from 'util'

const readFileAsync = util.promisify(fs.readFile)

export interface ITestJson {
  idx: number
  val: string
}

export class TestProvider {
  constructor(private inFile: string) {}

  async filterFile(filterBy: string): Promise<number> {
    const fileContent: ITestJson[] = JSON.parse((await readFileAsync(this.inFile)).toString())

    return fileContent
      .filter(el => el.val === filterBy)
      .length
  }
}