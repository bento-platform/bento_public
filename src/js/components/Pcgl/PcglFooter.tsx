import { Flex, Layout } from 'antd';
const { Footer } = Layout;

const PcglFooter = () => {
  return (
    <Footer id="pcgl-footer">
      <Flex align="center">
        <div className="flex-1">
          <img
            src="https://genomelibrary.ca/wp-content/uploads/2024/11/logo-white.svg"
            alt="Pan-Canadian Genome Library"
            style={{ width: 200, height: 'auto' }}
          />
          <p>PCGL is supported by the Canadian Institutes of Health Research (CIHR).</p>
        </div>
        <div
          className="flex-1"
          style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', columnGap: 12, rowGap: 18 }}
        >
          <a href="#">Contact Us</a>
          <a href="#">Policies &amp; Guidelines</a>
          <a href="#">Help Guides</a>
          <a href="#">Controlled Data Users</a>
          <a href="#">PCGL Website</a>
          <a href="#">Data Platform</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Publication Policy</a>
        </div>
      </Flex>
    </Footer>
  );
};

export default PcglFooter;
