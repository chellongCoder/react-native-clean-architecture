## Cách tao ra 1 native module bang expo

- npx create-expo-module <name-module>


- cd vao module, xoá expo-module-core trong package-json cua no di 

- thêm <name-module> vao package json: "<name-module>": "link://<name-module>"

- go yarn

- cd ios && pod install
