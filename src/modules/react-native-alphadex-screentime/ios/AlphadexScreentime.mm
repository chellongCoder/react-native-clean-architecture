#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AlphadexScreentime, RCTEventEmitter)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

@interface RCT_EXTERN_MODULE(ScreenTimeSelectAppsModel, RCTEventEmitter)
//- (NSArray<NSString *> *)supportedEvents {
//    return @[@"BlockApps", @"FFmpegKitCompleteCallbackEvent", @"FFmpegKitLogCallbackEvent"];
//}
//- (void)sendEventName:(NSString *)eventName body:(id)body {
//  NSLog(@"CustomEventsEmitter sendEventName emitting event: %@", eventName);
//  [self sendEventWithName:eventName body:body];
//}
RCT_EXPORT_VIEW_PROPERTY(onChangeBlock, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(childrendId, NSString)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sentEvent:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestScreenTime:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(selectedAppsData:(NSString)childrenId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getStateBlocking:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(blockApps:(NSString)childrenId withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unBlockApps:(NSString)childrenId withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

@interface RCT_EXTERN_MODULE(ViewModuleViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(color, NSString)
RCT_EXPORT_VIEW_PROPERTY(onChangeBlock, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(childrenId, NSString)

@end
