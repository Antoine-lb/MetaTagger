import React, { useCallback, useEffect, useState } from 'react';

import { IconSet } from 'widgets/icons';
import { Toolbar, ToolbarButton } from 'widgets/toolbar';
import { RendererMessenger } from '../../ipc/renderer';
import { useStore } from '../contexts/StoreContext';
import { ClientFile } from '../entities/File';
import { AppToaster } from './Toaster';

// type ExifField = { label: string; modifiable?: boolean; format?: (val: string) => ReactNode };

// Details: https://www.vcode.no/web/resource.nsf/ii2lnug/642.htm
// const exifFields: Record<string, ExifField> = {
//   'MWG:Description': { label: 'Description', modifiable: true },
// };

// const exifTags = Object.keys(exifFields);

const stopPropagation = (e: React.KeyboardEvent<HTMLTextAreaElement>) => e.stopPropagation();

interface ImageInfoProps {
  file: ClientFile;
}

const ImageInfo = ({ file }: ImageInfoProps) => {
  const descriptionKey = 'Parameters';
  const { exifTool } = useStore();

  const [descriptionValue, setDescriptionValue] = useState('');
  const [descriptionOriginalValue, setDescriptionOriginalValue] = useState('');

  useEffect(() => {
    exifTool
      .readParameters(file.absolutePath)
      .then((description) => {
        setDescriptionValue(description || '');
        setDescriptionOriginalValue(description || '');
      })
      .catch((err) => {
        AppToaster.show({
          message: 'Error reading EXIF data',
          clickAction: { label: 'View', onClick: RendererMessenger.toggleDevTools },
          timeout: 6000,
        });
        setDescriptionValue('');
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.absolutePath]);

  const handleEditSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const data: Record<string, string> = {};
      data[descriptionKey] = descriptionValue;

      // Antoine: funciona para "Description" pero no para "Parameters"
      console.log('data', data);
      exifTool
        .writeData(file.absolutePath, data)
        .then(() => {
          AppToaster.show({ message: 'Image Parameters updated', timeout: 3000 });
          setDescriptionOriginalValue(descriptionValue);
        })
        .catch((err) => {
          AppToaster.show({
            message: 'Could not updated image Parameters',
            clickAction: { label: 'View', onClick: RendererMessenger.toggleDevTools },
            timeout: 6000,
          });
          console.error('Could not update image Parameters', err);
        });
    },
    [descriptionValue, exifTool, file.absolutePath],
  );

  return (
    <div className="inspector-section">
      <p className="parameters-box">{descriptionValue}</p>
    </div>
  );
};

export default React.memo(ImageInfo);
