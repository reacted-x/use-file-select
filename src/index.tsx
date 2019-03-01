import React, { useRef, useCallback, useMemo } from 'react';

export interface UploadButtonProps {
  onSelect?: (f: FileList) => any;
  url?: string;
  onUpload?: (response: fileUploadResponse[]) => any;
  accept?: string;
  multiple?: boolean;
}

export interface fileUploadResponse {
  DfsPath: string;
  ClienUrl: string;
}

/* 处理数据上传
url: 数据上传接口
fileList: 数据上传对象列表
 */
function upload(
  url: string,
  fileList: FileList
): Promise<fileUploadResponse[]> {
  let uploadTasks: Promise<fileUploadResponse>[] = [];
  for (let i = 0; i < fileList.length; i++) {
    let file = fileList[i];
    let formData = new FormData();
    formData.append('uploadImg', file);
    uploadTasks.push(
      fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData
      }).then(res => {
        return res.json();
      })
    );
  }
  return Promise.all(uploadTasks).then(ress => {
    return ress.map(res => {
      return {
        DfsPath: res.DfsPath,
        ClienUrl: res.ClienUrl
      };
    });
  });
}

/* 

*/
function useFileUpload(
  props: UploadButtonProps = { multiple: false, accept: '*' }
): [JSX.Element, () => void] {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = useCallback(() => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  }, []);
  const handleFileChange = useCallback(({ target }) => {
    if (target.files !== null && typeof props.onSelect === 'function') {
      props.onSelect(target.files);
      if (typeof props.url === 'string') {
        upload(props.url, target.files).then(props.onUpload);
      }
    }
  }, [props.onSelect]);

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
    []
  );

  return [fileInput, handleButtonClick];
}

export { useFileUpload as default };
