import React, { useRef, useCallback, useMemo } from 'react';

export interface UploadButtonProps {
  onSelect?: (f: FileList | File[]) => any;
  accept?: string;
  multiple?: boolean;
  limit?: number;
  sizeLimit?: number;
  onError?: (msg: any) => any;
}

export interface MsgType {
  overSize: number,
  readError: number,
  overLimit: number,
  networkFail: number
}

// 导出错误类型
export  const msgType:MsgType = {
  overSize: 1,
  readError: 2,
  overLimit: 3,
  networkFail: 4
} 


//检测文件个数是否超出上限，如果超出，调用props.onError方法，对所有文件不做任何处理，是第一轮检测，
const checkFileNumber = (files: FileList, limit?: number): boolean => {
  if (!limit) return true;
  return files.length <= limit;
};

// 对文件体积进行检测，如果文件当中有超出体积的，对文件进行过滤，只处理体积在限制范围之内的， 同时如果有超体积文件，调用props.onError方法
const checkFileSizeLimit = (
  files: FileList,
  handleError: (err: { type: number; files: File[] }) => any,
  sizeLimit?: number,
): File[] => {
  let allFiles = Array.prototype.slice.call(files) as File[];
  if (!sizeLimit) return allFiles;
  let incorrectFiles: File[] = []; //用来存有问题的文件
  let correctFiles: File[] = []; //用来存没有问题的文件
  allFiles.forEach((file, index) => {
    if (file.size / 1000 / 1000 > sizeLimit) {
      incorrectFiles.push(file);
    } else {
      correctFiles.push(file);
    }
  });
  if (incorrectFiles.length > 0) {
    handleError({
      type: msgType.overSize,
      files: incorrectFiles
    });
  }
  return correctFiles;
};

// hooks本身， 返回用来触发上传框的
function useFileUpload(
  props: UploadButtonProps = { multiple: false, accept: '*' }
): [JSX.Element, () => void] {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = useCallback(() => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  }, []);

  const handleError = (err:any) => {
    if (props.onError) {
      props.onError(err);
    }
  };

  const handleFileChange = useCallback(({ target }) => {
    let files = target.files;
    if (!checkFileNumber(files, props.limit)) {
      handleError({ type: msgType.overLimit });
      return;
    }
    let correctFiles = checkFileSizeLimit(files, handleError, props.sizeLimit);
    if(!correctFiles.length) return;
    if (props.onSelect) {
      props.onSelect(correctFiles);;
    }
  }, [props.onSelect, props.limit, props.sizeLimit]);

  const fileInput = useMemo(
    () => (
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        ref={inputRef}
        multiple={props.multiple}
        accept={props.accept}
      />
    ),
    [handleFileChange, props.multiple, props.accept]
  );

  return [fileInput, handleButtonClick];
}

export { useFileUpload as default };
