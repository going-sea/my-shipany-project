/**
 * AI Configs to use AI functions
 */
export interface AIConfigs {
  [key: string]: any;
}

/**
 * ai media type
 */
export enum AIMediaType {
  MUSIC = 'music',
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
  SPEECH = 'speech',
}

export interface AISong {
  id?: string;
  createTime?: Date;
  audioUrl: string;
  imageUrl: string;
  duration: number;
  prompt: string;
  title: string;
  tags: string;
  style: string;
  model?: string;
  artist?: string;
  album?: string;
}

/**
 * AI generate params
 */
export interface AIGenerateParams {
  mediaType: AIMediaType;
  prompt: string;
  model?: string;
  // custom options
  options?: any;
  // receive notify result
  callbackUrl?: string;
  // is return stream
  stream?: boolean;
  // is async
  async?: boolean;
}

export enum AITaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

/**
 * AI task info
 */
export interface AITaskInfo {
  songs?: AISong[];
  status?: string; // provider task status
  errorCode?: string;
  errorMessage?: string;
  createTime?: Date;
}

/**
 * AI task result
 */
export interface AITaskResult {
  taskStatus: AITaskStatus;
  taskId: string; // provider task id
  taskInfo?: AITaskInfo;
  taskResult?: any; // raw result from provider
}

/**
 * AI Provider provide AI functions
 */
export interface AIProvider {
  // provider name
  readonly name: string;

  // provider configs
  configs: AIConfigs;

  // generate content
  generate({ params }: { params: AIGenerateParams }): Promise<AITaskResult>;

  // query task
  query?({ taskId }: { taskId: string }): Promise<AITaskResult>;
}

/**
 * AI Manager to manage all AI providers
 */
export class AIManager {
  // ai providers
  private providers: AIProvider[] = [];
  // default ai provider
  private defaultProvider?: AIProvider;

  // add ai provider
  addProvider(provider: AIProvider, isDefault = false) {
    this.providers.push(provider);
    if (isDefault) {
      this.defaultProvider = provider;
    }
  }

  // get provider by name
  getProvider(name: string): AIProvider | undefined {
    return this.providers.find((p) => p.name === name);
  }

  // get all provider names
  getProviderNames(): string[] {
    return this.providers.map((p) => p.name);
  }

  // get all media types
  getMediaTypes(): string[] {
    return Object.values(AIMediaType);
  }

  getDefaultProvider(): AIProvider | undefined {
    // set default provider if not set
    if (!this.defaultProvider && this.providers.length > 0) {
      this.defaultProvider = this.providers[0];
    }

    return this.defaultProvider;
  }

  // generate content
  generate({
    params,
    provider,
  }: {
    params: AIGenerateParams;
    provider?: string;
  }): Promise<AITaskResult> {
    if (provider) {
      const providerInstance = this.getProvider(provider);
      if (!providerInstance) {
        throw new Error(`AI provider '${provider}' not found`);
      }
      return providerInstance.generate({ params });
    }

    const defaultProvider = this.getDefaultProvider();
    if (!defaultProvider) {
      throw new Error('No AI provider configured');
    }

    return defaultProvider.generate({ params });
  }

  // query content
  query({
    taskId,
    provider,
  }: {
    taskId: string;
    provider?: string;
  }): Promise<AITaskResult> {
    if (provider) {
      const providerInstance = this.getProvider(provider);
      if (!providerInstance) {
        throw new Error(`AI provider '${provider}' not found`);
      }
      if (!providerInstance.query) {
        throw new Error(`AI provider '${provider}' no query method`);
      }
      return providerInstance.query({ taskId });
    }

    const defaultProvider = this.getDefaultProvider();
    if (!defaultProvider) {
      throw new Error('No AI provider configured');
    }

    if (!defaultProvider.query) {
      throw new Error(`AI provider '${defaultProvider.name}' no query method`);
    }

    return defaultProvider.query({ taskId });
  }
}

// ai manager
export const aiManager = new AIManager();

export * from './kie';
