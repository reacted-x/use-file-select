import { useRef, useCallback } from 'react';

export interface UploadButtonProps {
  onSelect?: (f: FileList) => any;
  url?: string;
  onUpload?: (response: fileUploadResponse[]) => any;
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
  props: UploadButtonProps
): [
  React.RefObject<HTMLInputElement>,
  () => void,
  (e: React.SyntheticEvent<HTMLInputElement>) => any
] {
  const fileInput = useRef<HTMLInputElement>(null);
  const handleButtonClick = useCallback(() => {
    if (fileInput.current !== null) {
      fileInput.current.click();
    }
  }, []);
  const handleFileChange = useCallback(({ target }) => {
    if (target.files !== null && typeof props.onSelect === 'function') {
      props.onSelect(target.files);
      if (typeof props.url === 'string') {
        upload(props.url, target.fileData).then(props.onUpload);
      }
    }
  }, []);

  return [fileInput, handleButtonClick, handleFileChange];
}

export { useFileUpload as default };
