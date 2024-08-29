
#import <React/RCTEventEmitter.h>
#import <AVFoundation/AVFoundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNTextToSpeechSpec.h"

@interface TextToSpeechAlphadex : RCTEventEmitter <NativeTextToSpeechSpec, AVSpeechSynthesizerDelegate>

#else
#import <React/RCTBridgeModule.h>

@interface TextToSpeechAlphadex : RCTEventEmitter <RCTBridgeModule, AVSpeechSynthesizerDelegate>
#endif

@property (nonatomic, strong) AVSpeechSynthesizer *synthesizer;
@property (nonatomic, strong) AVSpeechSynthesisVoice *defaultVoice;
@property (nonatomic) float defaultRate;
@property (nonatomic) float defaultPitch;
@property (nonatomic) bool ducking;

@end
