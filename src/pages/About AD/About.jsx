import React from "react";
// import Banner from "../../assets/img/banner1.png";
import About1 from "../../assets/img/about/about.png";
import Partner1 from "../../assets/img/about_partner/1.png";
import Partner2 from "../../assets/img/about_partner/2.png";
import Partner3 from "../../assets/img/about_partner/3.png";
import Partner4 from "../../assets/img/about_partner/4.png";
import Partner5 from "../../assets/img/about_partner/5.png";
import Partner6 from "../../assets/img/about_partner/6.png";
import Advisor1 from "../../assets/img/advisor/1.png";
import Advisor2 from "../../assets/img/advisor/2.png";
import Advisor3 from "../../assets/img/advisor/3.png";
import Cross from "../../assets/img/icons/cross.png";
import List from "../../assets/img/about/list.png";
import Team1 from "../../assets/img/team/1.png";
import Team2 from "../../assets/img/team/2.png";
import Team3 from "../../assets/img/team/3.png";
import Team4 from "../../assets/img/team/4.png";
import Team5 from "../../assets/img/team/5.png";
import Team6 from "../../assets/img/team/6.png";
import Team7 from "../../assets/img/team/7.png";
import Team8 from "../../assets/img/team/8.png";
import Team9 from "../../assets/img/team/9.png";
import Team10 from "../../assets/img/team/10.png";
import Team11 from "../../assets/img/team/11.png";
import Team12 from "../../assets/img/team/12.png";
import Team13 from "../../assets/img/team/13.png";
import Team14 from "../../assets/img/team/14.png";

import "./About.css";
import Banner from "pages/Main/banner";

const About = () => {
  return (
    <div className="contentCol">
      <Banner />

      <div className="about_div">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="about_img">
                <img src={About1} alt="Images" />
              </div>
            </div>

            <div className="col-md-8">
              <div className="about_content">
                <h2>
                  About <span> Angeldust </span>
                </h2>

                <p>
                  Angel Dust is the beginning of an ecosystem that is heavily
                  community driven and is aiming to create history. The project
                  is founded by an experienced team that are also real world
                  businessmen. The team is super experienced and very successful
                  within the bsc space and filled with many marketers of many
                  projects that have been involved with billion dollar
                  marketcaps and billion dollar revenue generating platforms.
                  Angel Dust is backed by a utility in the form of a fully
                  fledged NFT Market Place and NFT Launch Pad, that is
                  comparable and also exceeds the features of OpenSea, there is
                  more utilities on the roadmap but sometimes its best to keep
                  them hidden until the time is right. Angel Dust has began its
                  journey by formulating a wide range of mind blowing
                  partnerships, ambassadors and advisors whose collective
                  experience is unparalleled in the space. This will play a huge
                  part in ensuring Angel Dust has an extremely engaged and
                  diverse community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about_token mt-md-5 mt-3 pt-md-5 pb-5">
        <div className="container">
          <h3 className="same_about_head">ANGEL DUST TOKENOMICS</h3>
          <div className="row">
            <div className="col-md-2 col-6">
              <div className="about_counter bg_grey">
                <h5>5%</h5>
                <p>Buy Tax</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="about_counter bg_green">
                <h5>5%</h5>
                <p>Sell Tax</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="about_counter bg_purple">
                <h5>1%</h5>
                <p>Team</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="about_counter bg_dark_pink">
                <h5>1%</h5>
                <p>Development</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="about_counter bg_skyblue">
                <h5>3%</h5>
                <p>Marketing</p>
              </div>
            </div>
          </div>

          <ul className="p-0 mb-0 mt-3">
            <li>
              <img src={List} className="mr-2" alt="Image" />
              Buy & Sell tax will be dropped to <span> 3% </span> at{" "}
              <span> 500M </span> marketcap
            </li>
            <li className="ml-xl-4">
              <img src={List} className="mr-2" alt="Image" />
              <span> 0% </span> Buy and Sell Tax at <span> 1B </span> or when
              applying for <span> 1T Exchange</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="team_div mt-3 pb-md-5">
        <div className="container">
          <h3 className="same_about_head mb-4">
            Team Behind Angeldust Innovation
          </h3>

          <div className="row">
            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team1} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Omar
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>CEO</h4>
                  <p className="mb-0">
                    Crypto influencer and super connected within the crypto
                    space. Omar is also an ambassador and partner with the
                    biggest and most successful projects on the #BNBChain. Omar
                    is known for being extremely trustworthy and passionate in
                    everything he involves himself in.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team2} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Mosen
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Co-Founder</h4>
                  <p className="mb-0">
                    Community building specialist. Business advisor with a
                    successful track record in helping startups reach
                    multimillion Dollar evaluations. Crypto enthusiast since
                    2015. Masters Degree in Economics and Finance.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team3} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Devan
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Co-Founder</h4>
                  <p className="mb-0">
                    NFT influencer, idealist and celebrity connections. Devan
                    has worked alongside many real world celebrities including
                    Kevin Heart, Jeffrey Star and Travis Barker.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team4} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Shanti
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Coder and Developer</h4>
                  <p className="mb-0">
                    BNBChain most experienced and top developer
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team5} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Cazed
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>NFT Marketplace design and consultant</h4>
                  <p className="mb-0">NFT Marketplace design and consultant</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team6} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Tiny
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>NFT designer/creator</h4>
                  <p className="mb-0">
                    NFT marketplace consultant and game creator
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team7} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Brothedaddy
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>NFT Marketplace Developer and Manager</h4>
                  <p className="mb-0">NFT Marketplace Developer and Manager</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team11} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Dane
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Marketer</h4>
                  <p className="mb-0">
                    Very experienced marketer within the crypto space. Dane has
                    been apart of and has helped in marketing in some of the
                    most successful projects including Floki Inu, Hokkaidu and
                    HODL
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team12} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Mr B
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Asia Marketing</h4>
                  <p className="mb-0">
                    DTC group owner and one of the best asian marketing agencies
                    within the crypto space. MR B has provided his services
                    through DTC group to billion dollar projects including
                    Wirtual and Amazy which hit an astonishing 900M marketcap
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team13} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Blakee
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Marketer</h4>
                  <p className="mb-0">
                    Very experienced and well connected marketer in the crypto
                    space who also played a vital role in FPS Token that
                    completely blew up
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team14} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    CryptoKid
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Versatile Marketing & Articles</h4>

                  <p className="mb-0">
                    CryptoKid is the leading articles provider within the crypto
                    space. CryptoKid has provided his services to many
                    successful crypto projects but one of the biggest standouts
                    would be Micropets which hit 250M marketcap
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Team10} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Comet
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Twitter Influencer and Partner</h4>

                  <p className="mb-0">
                    Comet is a big name and super popular on twitter especially
                    after hes major role in bringing insane exposure to the
                    cronos network through his token CROGE that hit 57M
                    marketcap on a BETA version chain. Comet will be working
                    closely with Angel Dust on twitter and twitter spaces to
                    attract huge community adoption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="team_div mt-md-3 mt-2 pb-md-5">
        <div className="container">
          <h3 className="same_about_head mb-4">Advisors</h3>

          <div className="row">
            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Advisor1} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Rude Cane
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Advisor</h4>
                  <p className="mb-0">
                    RCL owner and heavily connected within the crypto space.
                    Rude Cane has advised on really successful projects that
                    have hit 130M
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Advisor2} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Saul Pinksale
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Advisor</h4>
                  <p className="mb-0">
                    Pinksale CEO. Saul is one of the most successful people
                    within the Crypto space owning one of the biggest Launchpads
                    that has generated over billions of dollars in revenue
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6 col-12">
              <div className="team_box">
                <div className="team_img">
                  <img src={Advisor3} alt="Image" />
                </div>
                <div className="team_content mt-2">
                  <h4>
                    Travladd
                    <img src={Cross} className="ml-2 mr-2" alt="Image" />
                    Angel Dust
                  </h4>
                  <h4>Advisor</h4>
                  <p className="mb-0">
                    Most influential and well known BNBChain and crypto
                    influencer that is also very well connected. Travladd is
                    also an Ambassador for billion dollar projects and has
                    played major roles in some of the biggest crypto projects we
                    have ever witnessed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="partnership_div mt-md-3 mt-2 pb-5 mb-md-5">
        <div className="container">
          <h3 className="same_about_head mb-4">Angeldust Partnership</h3>

          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="angel_partner">
                <div className="row">
                  <div className="col-md-5 col-sm-5 col-5">
                    <div className="partnership_img">
                      <img src={Partner6} alt="Image" />
                    </div>
                  </div>

                  <div className="col-md-7 col-sm-7 col-7 pl-0">
                    <div className="partnership_content">
                      <h4 className="mb-2">PinkSale</h4>
                      <p>Twitter Influencer and Spaces CROGE 57M</p>
                      {/* <a href="https://www.pinksale.finance/" target="_blank" className="link">
                                        Visit us
                                    </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="angel_partner">
                <div className="row">
                  <div className="col-md-5 col-sm-5 col-5">
                    <div className="partnership_img">
                      <img src={Partner3} alt="Image" />
                    </div>
                  </div>

                  <div className="col-md-7 col-sm-7 col-7 pl-0">
                    <div className="partnership_content">
                      <h4 className="mb-2">CloudChat</h4>
                      <p>Twitter Influencer and Spaces CROGE 57M</p>
                      {/* <a href="https://www.cloudchat.com/" target="_blank" className="link">
                                        Visit us
                                    </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="angel_partner">
                <div className="row">
                  <div className="col-md-5 col-sm-5 col-5">
                    <div className="partnership_img">
                      <img src={Partner1} alt="Image" />
                    </div>
                  </div>

                  <div className="col-md-7 col-sm-7 col-7 pl-0">
                    <div className="partnership_content">
                      <h4 className="mb-2">Galaxy Heroes</h4>
                      <p>Twitter Influencer and Spaces CROGE 57M</p>
                      {/* <a href="https://twitter.com/GalaxyHeroesGHC?t=peEkkslMUxIVIDitNWo7bg&s=09" target="_blank" className="link">
                                        Visit us
                                    </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="angel_partner">
                <div className="row">
                  <div className="col-md-5 col-sm-5 col-5">
                    <div className="partnership_img">
                      <img src={Partner4} alt="Image" />
                    </div>
                  </div>

                  <div className="col-md-7 col-sm-7 col-7 pl-0">
                    <div className="partnership_content">
                      <h4 className="mb-2">Solitaire Prestige</h4>
                      <p>Twitter Influencer and Spaces CROGE 57M</p>
                      {/* <a href="https://t.me/TheSolitairePrestige" target="_blank" className="link">
                                        Visit us
                                    </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="angel_partner">
                <div className="row">
                  <div className="col-md-5 col-sm-5 col-5">
                    <div className="partnership_img">
                      <img src={Partner2} alt="Image" />
                    </div>
                  </div>

                  <div className="col-md-7 col-sm-7 col-7 pl-0">
                    <div className="partnership_content">
                      <h4 className="mb-2">Crypto Kid Finance</h4>
                      <p>Twitter Influencer and Spaces CROGE 57M</p>
                      {/* <a href="http://cryptokidfinance.com/" target="_blank" className="link">
                                        Visit us
                                    </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="angel_partner">
                <div className="row">
                  <div className="col-md-5 col-sm-5 col-5">
                    <div className="partnership_img">
                      <img src={Partner5} alt="Image" />
                    </div>
                  </div>

                  <div className="col-md-7 col-sm-7 col-7 pl-0">
                    <div className="partnership_content">
                      <h4 className="mb-2">Blockchain Brothers</h4>
                      <p>Twitter Influencer and Spaces CROGE 57M</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
