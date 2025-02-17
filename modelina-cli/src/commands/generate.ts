import ModelinaCommand from '../base';
import { readFile } from 'node:fs/promises';
import { Languages, ModelinaArgs, ModelinaFlags, generateModels } from '../helpers/generate';

export default class Models extends ModelinaCommand {
  static description = 'Generates typed models';
  static args = ModelinaArgs;
  static flags = ModelinaFlags;

  async run() {
    const { args, flags } = await this.parse(Models);
    const { language, file } = args;
    let document = "";
    try {
      document = await readFile(file, 'utf8');
    } catch {
      throw new Error(`Unable to read input file content: ${file}`);
    }

    const logger = {
      info: (message: string) => {
        this.log(message);
      },
      debug: (message: string) => {
        this.debug(message);
      },
      warn: (message: string) => {
        this.warn(message);
      },
      error: (message: string) => {
        this.error(message);
      },
    }

    const generatedModels = await generateModels(flags, document, logger, language as Languages);

    if (flags.output) {
      const generatedModelsString = generatedModels.map((model) => { return model.modelName; });
      logger.info(`Successfully generated the following models: ${generatedModelsString.join(', ')}`);
    } else {
      const generatedModelsString = generatedModels.map((model) => {
        return `## Model name: ${model.modelName}
${model.result}
`;
      });
      logger.info(`Successfully generated the following models: ${generatedModelsString.join('\n')}`);
    }
  }
}