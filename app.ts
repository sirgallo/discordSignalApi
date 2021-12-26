import { TestProvider } from './providers/test'

async function run(): Promise<true> {
  const args = process.argv;
  if (!args || args.length < 4) {
    throw new Error('Missing argument for JSON File');
  }

  const fileName = args[2]
  const filterBy = args[3]
  const content = await new TestProvider(fileName)
    .filterFile(filterBy)
  console.log(content)
  return true
}

run()
  .then(res => {
    console.log(res)
  })
  .catch( err => {
    console.log(err)
  })