'use strict';
import React, {Component} from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.off,
      },
      flashTorch: false,
      scanData: '',
      scanResult: null,
    };
  }

  onBarCodeRead(scanResult) {
    console.log(scanResult);
    console.log(JSON.stringify(scanResult));
    if (scanResult.data != null) {
      if (!this.barcodeCodes.includes(scanResult.data)) {
        this.barcodeCodes.push(scanResult.data);
        this.setState({
          ...this.state,
          scanData: scanResult.data,
          scanResult: scanResult,
        });
      } else {
        this.barcodeCodes = [];
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

  pendingView() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgreen',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Waiting</Text>
      </View>
    );
  }

  renderArea = () => {
    <View style={styles.scanArea(this.state.scanData.bounds)} />;
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          defaultTouchToFocus
          flashMode={this.state.camera.flashMode}
          mirrorImage={false}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          style={styles.preview}
          type={this.state.camera.type}>
          <BarcodeMask
            width={300}
            height={200}
            showAnimatedLine={true}
            animatedLineColor={'green'}
          />
        </RNCamera>

        <View
          style={{
            position: 'absolute',
            top: 0,
            flex: 1,
            flexDirection: 'row',
            margin: 5,
          }}>
          <View
            style={{
              backgroundColor: 'black',
              flex: 1,
              borderRadius: 10,
              padding: 6,
              paddingBottom: 10,
              alignItems: 'center',
            }}>
            <Text>Scan Result</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
              }}>
              {this.state.scanData}
            </Text>
          </View>
        </View>

        {this.state.scanResult && this.renderArea()}

        <View style={[styles.overlay, styles.bottomOverlay]}>
          <Button
            onPress={() => {
              if (!this.state.flashTorch) {
                this.setState({
                  camera: {
                    type: RNCamera.Constants.Type.back,
                    flashMode: RNCamera.Constants.FlashMode.torch,
                  },
                  flashTorch: true,
                });
              } else {
                this.setState({
                  camera: {
                    type: RNCamera.Constants.Type.back,
                    flashMode: RNCamera.Constants.FlashMode.off,
                  },
                  flashTorch: false,
                });
              }
            }}
            style={styles.enterBarcodeManualButton}
            title={this.state.flashTorch ? 'Turn off flash' : 'Turn on flash'}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: bounds => {
    return {
      borderWidth: 2,
      borderRadius: 10,
      position: 'absolute',
      borderColor: '#F00',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: 10,
      // ...bounds.size,
      // left: bounds.origin.x,
      // top: bounds.origin.y,
    };
  },
});
