import PocketBase from 'pocketbase';

// const pb = new PocketBase('http://127.0.0.1:8090');

export default new PocketBase(process.env.REACT_APP_POCKETBASE_URL)