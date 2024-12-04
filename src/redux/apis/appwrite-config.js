import { Client, Account, ID } from 'react-native-appwrite';

const client = new Client();
const project_id = process.env.EXPO_APPWRITE_PROJECT_ID;
const project_platform = process.env.EXPO_APPWRITE_PLATFORM;

client.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(project_id)
.setPlatform(project_platform);
