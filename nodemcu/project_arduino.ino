#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
EspSoftwareSerial::UART testSerial;
const char* ssid = "0";
const char* password = "00000000";
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "6a6e60b7-0a76-4f05-8f9c-892f30563e60";
const char* mqtt_username = "kbz2EPS9xdp399K7LE9aCS3Sg2kPPLmU";
const char* mqtt_password = "CgEF)Ln8aFOsPVx2lTmq!RFU4jqYpemh";
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
int value = 0;
char msg[100];


void setup() {
  testSerial.begin(115200, EspSoftwareSerial::SWSERIAL_8N1, D7, D8, false, 120, 120);
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
}
void reconnect() {
  while (!client.connected()) {
  Serial.print("Attempting MQTT connection...");
  if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
  Serial.println("connected");
}
else {
  Serial.print("failed, rc=");
  Serial.print(client.state());
  Serial.println("try again in 5 seconds");
  delay(5000);
}
}
}
void loop() {
// Echo
char adata[24];
float sdata[4];
sdata[0]=1.00;
sdata[2]=1.00;
sdata[3]=1.00;
while(testSerial.available()){
byte mn = testSerial.readBytesUntil('\0', adata,24);
if(mn!=0)
{
  int dot[4];
  for(int i=0,j=0;i<24,j<4;i++){
    if(adata[i]=='.') dot[j++]=i+2;
  }
  for(int i=0;i<4;i++){
  char cc=adata[dot[i]+1];
 adata[dot[i]+1]='\0';
  float aa=atof(adata);
  sdata[i]=aa;

 adata[dot[i]+1]=cc;
 for(int j=0;j<=dot[i];j++) adata[j]='0';
}
if (!client.connected()) {
    reconnect();
    }
    client.loop();

String data = "{\"data\": {\"ultrasonic\": " + String(sdata[0]) + ", \"water_level\": " + String(sdata[1]) + ", \"water_flow\" : "+ String(sdata[2])+", \"angle\": "
+String(sdata[3])+"}}";
    
    Serial.println(data);
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@shadow/data/update",msg);
}
break;}
  

   
    }
