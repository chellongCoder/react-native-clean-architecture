
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNTextToSpeechSpec.h"

@interface TextToSpeech : NSObject <NativeTextToSpeechSpec>
#else
#import <React/RCTBridgeModule.h>

@interface TextToSpeech : NSObject <RCTBridgeModule>
#endif

@end
