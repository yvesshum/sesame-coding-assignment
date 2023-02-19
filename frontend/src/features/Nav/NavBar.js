import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import truncateEthAddress from "truncate-eth-address";

export function NavBar() {
  const publicKey = useSelector((state) => state.user.publicKey);

  const handleConnectWallet = async () => {
    console.log("connect clicked")
    await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">SESAME LABS</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {publicKey ? (
              truncateEthAddress(publicKey)
            ) : (
              <Button onClick={handleConnectWallet} variant="light">
                Connect Wallet
              </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
