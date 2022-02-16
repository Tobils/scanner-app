import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

const barcodeRecognized = ({barcodes}) => {
  barcodes.barcodeRecognizedforEach(barcode => console.warn(barcode.data));
};
export class index extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
    };
  }

  onBarCodeRead(scanResult) {
    console.warn(scanResult.type);
    console.warn(scanResult.data);
    if (scanResult.data != null) {
      if (!this.barcodeCodes.includes(scanResult.data)) {
        this.barcodeCodes.push(scanResult.data);
        console.warn('onBarCodeRead call');
      }
    }
    return;
  }

  async takePicture() {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }

  render() {
    return (
      <View style={{flex: 1, marginVertical: 60}}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          type={'back'}
          style={{
            flex: 1,
            width: '100%',
          }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
        />
      </View>
    );
  }
}

export default index;
