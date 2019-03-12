## react hooks for file upload

```typescript
export interface UploadButtonProps {
  onSelect?: (f: FileList | File[]) => any;
  accept?: string;
  multiple?: boolean;
  limit?: number;
  sizeLimit?: number;
  onError?: (msg: any) => any;
}
```

## 参数说明
### onSelect
当用户选择了文件之后的回调，根据限制条件，只返回符合条件的文件列表 File[];

### accept
上传接受的文件类型, [查看示例](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers)

* A valid case-insensitive filename extension, starting with a period (".") character. For example: .jpg, .pdf, or .doc.
* A valid MIME type string, with no extensions.
* The string audio/* meaning "any audio file".
* The string video/* meaning "any video file".
* The string image/* meaning "any image file".

### mutilple
是否允许上传多个文件

### limit
文件个数的限制，如果选择的文件数量超出文件个数的限制，不执行任何处理，也不会调onSelect。会直接调用onError

### sizeLimit
文件体积的限制， 如果选择的文件体积超过限制，但不超过个数上限，会调用onSelect，并且调onError

### onError
选择文件过程中出现的各种错误， hooks调用此方法会传递msgType


## msgType

```ts
export interface MsgType {
  overSize: number,
  readError: number,
  overLimit: number
}

export const msgType {
  overSize: 1,
  readError: 2,
  overLimit: 3,
  networkFail: 4
}
```

### overSize
文件体积超过上限

### readErorr
文件读取错误

### overLimit
文件个数超出上限。

### networkFail
传输出错