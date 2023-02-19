import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { checkUSDCOwnership } from "../User/userSlice";
import { toast } from "react-toastify";
import config from "../../config.json"
export function Reward() {
  const dispatch = useDispatch();
  const publicKey = useSelector((state) => state.user.publicKey);
  const checkingUSDCOwnership = useSelector(
    (state) => state.user.checkingUSDCOwnership
  );
  const coupon = useSelector((state) => state.user.coupon);

  const handleBuyUSDC = () => {
    window.open("https://app.uniswap.org/");
  };
  const handleVerify = () => {
    dispatch(checkUSDCOwnership(publicKey));
  };
  const handleCouponClick = () => {
    navigator.clipboard.writeText(coupon);
    toast.info("Copied to clipboard!")
  }
  return (
    <div>
      <Container>
        <br />
        <Row className="py-2 px-2">
          <Col sm={12} lg={5}>
            <Stack gap={5}>
              <h1 className="banner">{config.quest.title}</h1>
              <p className="bannerSubtext">{config.quest.description}</p>

              {coupon === null ? (
                <Stack direction="horizontal" gap={5}>
                  <Button onClick={handleBuyUSDC}>Buy USDC</Button>
                  <Button
                    disabled={checkingUSDCOwnership}
                    onClick={handleVerify}
                    variant="warning"
                  >
                    Verify Completion
                  </Button>
                </Stack>
              ) : (
                <Button variant="success" onClick={handleCouponClick}>
                  Congrats! Here's your code: {coupon}
                </Button>
              )}
            </Stack>
          </Col>
          <Col sm={12} lg={7} className="mt-5 mt-lg-0">
            <Image src={config.quest.cover_image_uri} fluid rounded />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
