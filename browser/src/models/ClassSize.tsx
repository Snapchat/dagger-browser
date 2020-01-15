const METHOD_SIZE_BYTES = 60;
const FIELD_SIZE_BYTES = 30;

/** Stores class information from ApkAnalyzer output. */
export type ClassInfo = {
  method_count: number;
  lambda_count?: number; // temporarily optional for backward compatibility
  field_count: number;
  size: number;
  inner_class_count?: number; // temporarily optional for backward compatibility
}

/** Convenience class to output summary and memory based on class information. */
export default class ClassSize {
  classInfo: ClassInfo;

  constructor(classInfo: ClassInfo) {
    this.classInfo = classInfo;
  }

  /** Returns the class info as a single string, useful for popups or title/alt attributes. */
  getSummary(): string {
    let size = this.classInfo.size;
    let unit = 'B';
    if (size >= 1024) {
      size = Math.round(size / 1024);
      unit = 'kB';
    }
    return `dex size: ${size} ${unit}` +
        `\nmethods: ${this.classInfo.method_count}` +
        (this.classInfo.lambda_count ? `\nlambdas: ${this.classInfo.lambda_count}` : ``) +
        `\nfields: ${this.classInfo.field_count}` +
        (this.classInfo.inner_class_count ? `\ninner classes: ${this.classInfo.inner_class_count}` : ``);
  }

  /** Returns estimated memory size in bytes. */
  getMemorySize(): number {
    return this.classInfo.size + this.classInfo.method_count * METHOD_SIZE_BYTES + this.classInfo.field_count * FIELD_SIZE_BYTES;
  }

  add(classSize: ClassSize) {
    this.classInfo.method_count += classSize.classInfo.method_count;
    if (classSize.classInfo.lambda_count) {
      const count = this.classInfo.lambda_count || 0;
      this.classInfo.lambda_count = count + classSize.classInfo.lambda_count;
    }
    this.classInfo.field_count += classSize.classInfo.field_count;
    this.classInfo.size += classSize.classInfo.size;
    if (classSize.classInfo.inner_class_count) {
      const count = this.classInfo.inner_class_count || 0;
      this.classInfo.inner_class_count = count + classSize.classInfo.inner_class_count;
    }
  }
}
