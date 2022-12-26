/* eslint-disable @typescript-eslint/consistent-type-assertions */
import userHome from 'user-home';
import fsExtra from 'fs-extra';
import path from 'path';

import type { WriteFileOptions, ObjectEncodingOptions } from 'fs';

const defaultSetting: Setting = {
  filename: './configurerc',
  throw: false,
};

export interface Setting {
  filename: string;
  throw: boolean;
}

type unknownRecordable = Record<string, unknown>;

function safeParse(content: string, opts: { throw?: boolean } = {}) {
  try {
    return JSON.parse(content);
  } catch (e) {
    if (opts.throw) {
      throw e;
    }
    return {};
  }
}

function safeStringify(data: unknown, opts: { throw?: boolean } = {}): string {
  try {
    return JSON.stringify(data);
  } catch (e) {
    if (opts.throw) throw e;
    return JSON.stringify({});
  }
}

function merge<T extends unknownRecordable, G extends unknownRecordable>(prev: T, next: G): T & G {
  return { ...prev, ...next };
}

export class Configure<T extends unknownRecordable = unknownRecordable> {
  private filepath: string;

  private cache: T;

  public constructor(setting?: Setting & ObjectEncodingOptions) {
    const opts = { ...defaultSetting, ...setting };
    this.filepath = path.resolve(userHome, opts.filename);

    fsExtra.ensureFileSync(this.filepath);
    const Content = fsExtra
      .readFileSync(this.filepath, {
        encoding: opts.encoding,
      })
      .toString('utf-8');

    this.cache = safeParse(Content, opts);
  }

  public write<Z extends keyof T, Val extends Pick<T, Z>[Z]>(
    key: Z,
    data: Val,
    opts: WriteFileOptions & { warn: boolean } = { warn: false },
  ) {
    if (this.cache[key] && opts.warn) {
      console.warn(`${String(key)} is duplicate.`);
    }

    const prepareData = {
      [key]: data,
    };

    const val = merge(this.cache, prepareData);

    this.cache = val;
    const content = safeStringify(this.cache);
    fsExtra.writeFileSync(this.filepath, content, opts);
    return this.cache;
  }

  public read(key: keyof T) {
    return this.cache[key];
  }

  public clear() {
    fsExtra.removeSync(this.filepath);
    this.cache = {} as T;
    this.filepath = '';
  }

  public clearCache() {
    this.cache = {} as T;
    fsExtra.writeFileSync(this.filepath, '{}');
    return this.cache;
  }
}
