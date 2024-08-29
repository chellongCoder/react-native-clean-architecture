#import "TextToSpeech.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>

@implementation TextToSpeechAlphadex {
  NSString * _ignoreSilentSwitch;

}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

-(NSArray<NSString *> *)supportedEvents
{
    return @[@"tts-start", @"tts-finish", @"tts-pause", @"tts-resume", @"tts-progress", @"tts-cancel"];
}

- (instancetype) init {
  self = [super init];
  if(self) {
    _synthesizer = [AVSpeechSynthesizer new];
    _synthesizer.delegate = self;
    _ducking = false;
    _ignoreSilentSwitch = @"inherit";
  }

  return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(speak:(NSString *) text params:(NSDictionary*)params resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  if(!text) {
      reject(@"no_text", @"No text to speak", nil);
      return;
  }
  
  AVSpeechUtterance *utterance = [[AVSpeechUtterance alloc] initWithString:text];

  NSString* voice = [params valueForKey:@"iosVoiceId"];

  if (voice) {
      utterance.voice = [AVSpeechSynthesisVoice voiceWithIdentifier:voice];
  } else if (_defaultVoice) {
      utterance.voice = _defaultVoice;
  }

  float rate = [[params valueForKey:@"rate"] floatValue];
  if (rate) {
      if(rate > AVSpeechUtteranceMinimumSpeechRate && rate < AVSpeechUtteranceMaximumSpeechRate) {
          utterance.rate = rate;
      } else {
          reject(@"bad_rate", @"Wrong rate value", nil);
          return;
      }
  } else if (_defaultRate) {
      utterance.rate = _defaultRate;
  }

  if (_defaultPitch) {
          utterance.pitchMultiplier = _defaultPitch;
      }

      if([_ignoreSilentSwitch isEqualToString:@"ignore"]) {
          [[AVAudioSession sharedInstance]
           setCategory:AVAudioSessionCategoryPlayback
           mode:AVAudioSessionModeVoicePrompt
           // This will pause a spoken audio like podcast or audiobook and duck the volume for music
           options:AVAudioSessionCategoryOptionInterruptSpokenAudioAndMixWithOthers
           error:nil
          ];
      } else if([_ignoreSilentSwitch isEqualToString:@"obey"]) {
          [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
      }

  [self.synthesizer speakUtterance:utterance];
  resolve([NSNumber numberWithUnsignedLong:utterance.hash]);


}

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSNumber *result = @(a * b);

    resolve(result);
}


@end
