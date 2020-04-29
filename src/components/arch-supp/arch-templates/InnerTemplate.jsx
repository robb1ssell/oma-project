import React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { getFileTypeIconProps } from '@uifabric/file-type-icons';

const InnerTemplate = props => {
  let fileIcon = ext => {
    return <Icon {...getFileTypeIconProps({ extension: `${ext}`, size: 48, imageFileType: 'svg' }) } />
  }
  
  let regIcon = name => {
    return <Icon iconName={`${name}`} className='fabricIcon'/>
  }

  let icon;
  switch (props.fileType) {
    case 'xlsx':
      icon = fileIcon('xlsx');
      break;
    case 'pptx':
      icon = fileIcon('pptx');
      break;
    case 'vsd':
    case 'vsdx':
    case 'vst':
    case 'vstx':
      icon = fileIcon('vsdx');
      break;
    case 'mp4':
      icon = regIcon('MSNVideos');
      break;
    case 'pdf':
      icon = regIcon('PDF');
      break;
    default:
      break;
  }
  
  return (
    <div>
      <a href={props.url} className='d-flex align-items-center'>
        {icon}
        <span className='pl-2'>{props.name}</span>
      </a>
    </div>
  );
};

export default InnerTemplate;