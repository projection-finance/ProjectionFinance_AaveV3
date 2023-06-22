import asdf from "../public/icons/tokens/aave.svg";
import aave from '../public/icons/tokens/aave.svg';
import avax from '../public/icons/tokens/avax.svg';
import btc from '../public/icons/tokens/btc.svg';
import dai from '../public/icons/tokens/dai.svg';
import frax from '../public/icons/tokens/frax.svg';
import link from '../public/icons/tokens/link.svg';
import mai from '../public/icons/tokens/mai.svg';
import savax from '../public/icons/tokens/savax.svg';
import usdc from '../public/icons/tokens/usdc.svg';
import usdt from '../public/icons/tokens/usdt.svg';
import wavax from '../public/icons/tokens/wavax.svg';
import wbtc from '../public/icons/tokens/wbtc.svg';
import weth from '../public/icons/tokens/weth.svg';
import eth from '../public/icons/tokens/eth.svg';

import aergo from '../public/icons/networks/aergo.svg';
import ok from '../public/icons/networks/ok.svg';
import orbs from '../public/icons/networks/orbs.svg';
import polygon from '../public/icons/networks/polygon.svg';

import compound from '../public/icons/platforms/compound.svg';
import uniswap from '../public/icons/platforms/uniswap.svg';

const CryptoIcon = (props) => {
  const { label, className } = props;

  const icons = [
    {
      label: 'aave',
      icon: <img src={aave} className={className} alt="crypto" />
    },
    {
      label: 'avax',
      icon: <img src={avax} className={className} alt="crypto" />
    },
    {
      label: 'btc',
      icon: <img src={btc} className={className} alt="crypto" />
    },
    {
      label: 'dai',
      icon: <img src={dai} className={className} alt="crypto" />
    },
    {
      label: 'frax',
      icon: <img src={frax} className={className} alt="crypto" />
    },
    {
      label: 'link',
      icon: <img src={link} className={className} alt="crypto" />
    },
    {
      label: 'mai',
      icon: <img src={mai} className={className} alt="crypto" />
    },
    {
      label: 'savax',
      icon: <img src={savax} className={className} alt="crypto" />
    },
    {
      label: 'usdc',
      icon: <img src={usdc} className={className} alt="crypto" />
    },
    {
      label: 'usdt',
      icon: <img src={usdt} className={className} alt="crypto" />
    },
    {
      label: 'wavax',
      icon: <img src={wavax} className={className} alt="crypto" />
    },
    {
      label: 'wbtc',
      icon: <img src={wbtc} className={className} alt="crypto" />
    },
    {
      label: 'weth',
      icon: <img src={weth} className={className} alt="crypto" />
    },
    {
      label: 'aergo',
      icon: <img src={aergo} className={className} alt="crypto" />
    },
    {
      label: 'eth',
      icon: <img src={eth} className={className} alt="crypto" />
    },
    {
      label: 'ok',
      icon: <img src={ok} className={className} alt="crypto" />
    },
    {
      label: 'orbs',
      icon: <img src={orbs} className={className} alt="crypto" />
    },
    {
      label: 'polygon',
      icon: <img src={polygon} className={className} alt="crypto" />
    },
    {
      label: 'compound',
      icon: <img src={compound} className={className} alt="crypto" />
    },
    {
      label: 'uniswap',
      icon: <img src={uniswap} className={className} alt="crypto" />
    }
  ]

  console.log("select lable", label);

  const getSource = (label) => {
    const selected = label && icons.find(item => item.label.toLowerCase() === label.toLowerCase());

    return selected?.icon
  }

  return (
    <>
      {getSource(label)}
    </>
  )
};

export default CryptoIcon;