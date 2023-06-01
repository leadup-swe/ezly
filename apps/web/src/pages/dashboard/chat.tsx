import SendbirdApp from '@sendbird/uikit-react/App';
import '@sendbird/uikit-react/dist/index.css';
import { DashboardLayout } from 'src/components/templates/dashboard-layout';
import { NextPageWithLayout } from 'src/types/next';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

const Page: NextPageWithLayout = () => {
  return (
    <div style={{ height: `100vh`, width: `100%` }}>
      {/* <App appId='95D07343-8CD9-479A-B4CA-218412D72C42' userId='user_2O5eh42pqeFhVQrBas3Yk2y6UfR'> */}
      <SendbirdProvider isMentionEnabled appId='95D07343-8CD9-479A-B4CA-218412D72C42' userId='user_2O5eh42pqeFhVQrBas3Yk2y6UfR'>
        <SendbirdApp // Add the two lines below.
          appId='95D07343-8CD9-479A-B4CA-218412D72C42'
          userId='user_2O5eh42pqeFhVQrBas3Yk2y6UfR'
        />
      </SendbirdProvider>
      {/* </App> */}
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
