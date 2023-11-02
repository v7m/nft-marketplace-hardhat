const { expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const fs = require("fs");

const blueShapeSVG = fs.readFileSync("./assets/images/blue.svg", { encoding: "utf8" });
const greenShapeSVG = fs.readFileSync("./assets/images/green.svg", { encoding: "utf8" });
const orangeShapeSVG = fs.readFileSync("./assets/images/orange.svg", { encoding: "utf8" });
const redShapeSVG = fs.readFileSync("./assets/images/red.svg", { encoding: "utf8" });

const blueShapeBase64 = "data:image/svg+xml;base64,PHN2ZyBpZD0idmlzdWFsIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNmZmZmZmYiPjwvcmVjdD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjIuNDM0NTQzODU1ODM0NzYgMTk0LjQwNDY1MDg3MzQ3OTMpIj48cGF0aCBkPSJNMjkuNiAtMTcuM0M0Mi45IC02LjkgNjEuNCA1LjcgNzUuNCA0Ni41Qzg5LjUgODcuMiA5OSAxNTYuMiA2OS45IDE4NS45QzQwLjggMjE1LjYgLTI2LjkgMjA2IC01MS42IDE3MEMtNzYuNCAxMzQgLTU4LjIgNzEuNiAtNjkgMTcuNkMtNzkuOCAtMzYuMyAtMTE5LjcgLTgxLjggLTExMyAtOTAuNkMtMTA2LjMgLTk5LjUgLTUzLjIgLTcxLjcgLTIyLjUgLTUzLjhDOC4xIC0zNS44IDE2LjMgLTI3LjcgMjkuNiAtMTcuMyIgZmlsbD0iIzAwNjZGRiI+PC9wYXRoPjwvZz48L3N2Zz4=";
const greenShapeBase64 = "data:image/svg+xml;base64,PHN2ZyBpZD0idmlzdWFsIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNmZmZmZmYiPjwvcmVjdD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMDUuNjg3OTA2NzI2MDMyNiAxNzQuODUzMTg0OTc5MjEzNCkiPjxwYXRoIGQ9Ik0yOS44IC0yOC40QzM3IC00LjcgNDAuMSAxMC4yIDM0LjUgNjUuNUMyOC45IDEyMC44IDE0LjQgMjE2LjcgLTI4LjEgMjMyLjlDLTcwLjcgMjQ5LjIgLTE0MS41IDE4NS44IC0xNDguMiAxMjkuOEMtMTU1IDczLjggLTk3LjkgMjUuMiAtNjIuNSAtMTQuN0MtMjcuMSAtNTQuNyAtMTMuNiAtODUuOCAtMS4xIC04NS4yQzExLjMgLTg0LjUgMjIuNiAtNTIgMjkuOCAtMjguNCIgZmlsbD0iIzAwOTQ3MyI+PC9wYXRoPjwvZz48L3N2Zz4="
const orangeShapeBase64 = "data:image/svg+xml;base64,PHN2ZyBpZD0idmlzdWFsIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNmZmZmZmYiPjwvcmVjdD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMjIuNDQ5MzYyNTczNDg5MjggMjAxLjE1MTkyODk2MTU2OTQ3KSI+PHBhdGggZD0iTTEwOS4xIC04M0MxNTAuNyAtNjcuNCAyMDAuNCAtMzMuNyAyMDIgMS42QzIwMy43IDM3IDE1Ny4zIDc0IDExNS43IDExMy4zQzc0IDE1Mi43IDM3IDE5NC4zIDAuNyAxOTMuNkMtMzUuNiAxOTIuOSAtNzEuMiAxNDkuOCAtOTkuNSAxMTAuNUMtMTI3LjggNzEuMiAtMTQ4LjkgMzUuNiAtMTQ2LjggMi4xQy0xNDQuNyAtMzEuMyAtMTE5LjQgLTYyLjcgLTkxIC03OC4zQy02Mi43IC05NCAtMzEuMyAtOTMuOSAxLjIgLTk1QzMzLjcgLTk2LjIgNjcuNCAtOTguNyAxMDkuMSAtODMiIGZpbGw9IiNGQ0FGM0MiPjwvcGF0aD48L2c+PC9zdmc+"
const redShapeBase64 = "data:image/svg+xml;base64,PHN2ZyBpZD0idmlzdWFsIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNmZmZmZmYiPjwvcmVjdD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMDIuNzU3NDI3NDMzMTQ2NjMgMjY5Ljg1Mjk0MDE5NDkzNzcpIj48cGF0aCBkPSJNNzUuNSAtOTkuN0M4NS45IC02NS4xIDc0LjIgLTMyLjUgNzQuMSAtMC4xQzc0IDMyLjMgODUuNCA2NC42IDc1IDg5LjdDNjQuNiAxMTQuOSAzMi4zIDEzMyA4LjUgMTI0LjVDLTE1LjMgMTE2IC0zMC42IDgxIC03Mi4zIDU1LjhDLTExNCAzMC42IC0xODIgMTUuMyAtMTg1LjIgLTMuMkMtMTg4LjQgLTIxLjcgLTEyNi43IC00My40IC04NSAtNzhDLTQzLjQgLTExMi43IC0yMS43IC0xNjAuNCA1LjQgLTE2NS44QzMyLjUgLTE3MS4yIDY1LjEgLTEzNC40IDc1LjUgLTk5LjciIGZpbGw9IiNGRjAwNjYiPjwvcGF0aD48L2c+PC9zdmc+"

const blueShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU2hhcGUgU1ZHICMwIiwgImRlc2NyaXB0aW9uIjogIkFuIE5GVCB0aGF0IGNoYW5nZXMgYmFzZWQgb24gdGhlIGFtb3VudCBvZiBtaW50aW5nIGZlZSIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUJwWkQwaWRtbHpkV0ZzSWlCMmFXVjNRbTk0UFNJd0lEQWdOVEF3SURVd01DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJZ2VHMXNibk02ZUd4cGJtczlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1RrdmVHeHBibXNpSUhabGNuTnBiMjQ5SWpFdU1TSStQSEpsWTNRZ2VEMGlNQ0lnZVQwaU1DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlHWnBiR3c5SWlObVptWm1abVlpUGp3dmNtVmpkRDQ4WnlCMGNtRnVjMlp2Y20wOUluUnlZVzV6YkdGMFpTZ3lOakl1TkRNME5UUXpPRFUxT0RNME56WWdNVGswTGpRd05EWTFNRGczTXpRM09UTXBJajQ4Y0dGMGFDQmtQU0pOTWprdU5pQXRNVGN1TTBNME1pNDVJQzAyTGprZ05qRXVOQ0ExTGpjZ056VXVOQ0EwTmk0MVF6ZzVMalVnT0RjdU1pQTVPU0F4TlRZdU1pQTJPUzQ1SURFNE5TNDVRelF3TGpnZ01qRTFMallnTFRJMkxqa2dNakEySUMwMU1TNDJJREUzTUVNdE56WXVOQ0F4TXpRZ0xUVTRMaklnTnpFdU5pQXROamtnTVRjdU5rTXROemt1T0NBdE16WXVNeUF0TVRFNUxqY2dMVGd4TGpnZ0xURXhNeUF0T1RBdU5rTXRNVEEyTGpNZ0xUazVMalVnTFRVekxqSWdMVGN4TGpjZ0xUSXlMalVnTFRVekxqaERPQzR4SUMwek5TNDRJREUyTGpNZ0xUSTNMamNnTWprdU5pQXRNVGN1TXlJZ1ptbHNiRDBpSXpBd05qWkdSaUkrUEM5d1lYUm9Qand2Wno0OEwzTjJaejQ9In0=";
const greenShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU2hhcGUgU1ZHICMwIiwgImRlc2NyaXB0aW9uIjogIkFuIE5GVCB0aGF0IGNoYW5nZXMgYmFzZWQgb24gdGhlIGFtb3VudCBvZiBtaW50aW5nIGZlZSIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUJwWkQwaWRtbHpkV0ZzSWlCMmFXVjNRbTk0UFNJd0lEQWdOVEF3SURVd01DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJZ2VHMXNibk02ZUd4cGJtczlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1RrdmVHeHBibXNpSUhabGNuTnBiMjQ5SWpFdU1TSStQSEpsWTNRZ2VEMGlNQ0lnZVQwaU1DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlHWnBiR3c5SWlObVptWm1abVlpUGp3dmNtVmpkRDQ4WnlCMGNtRnVjMlp2Y20wOUluUnlZVzV6YkdGMFpTZ3pNRFV1TmpnM09UQTJOekkyTURNeU5pQXhOelF1T0RVek1UZzBPVGM1TWpFek5Da2lQanh3WVhSb0lHUTlJazB5T1M0NElDMHlPQzQwUXpNM0lDMDBMamNnTkRBdU1TQXhNQzR5SURNMExqVWdOalV1TlVNeU9DNDVJREV5TUM0NElERTBMalFnTWpFMkxqY2dMVEk0TGpFZ01qTXlMamxETFRjd0xqY2dNalE1TGpJZ0xURTBNUzQxSURFNE5TNDRJQzB4TkRndU1pQXhNamt1T0VNdE1UVTFJRGN6TGpnZ0xUazNMamtnTWpVdU1pQXROakl1TlNBdE1UUXVOME10TWpjdU1TQXROVFF1TnlBdE1UTXVOaUF0T0RVdU9DQXRNUzR4SUMwNE5TNHlRekV4TGpNZ0xUZzBMalVnTWpJdU5pQXROVElnTWprdU9DQXRNamd1TkNJZ1ptbHNiRDBpSXpBd09UUTNNeUkrUEM5d1lYUm9Qand2Wno0OEwzTjJaejQ9In0="
const orangeShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU2hhcGUgU1ZHICMwIiwgImRlc2NyaXB0aW9uIjogIkFuIE5GVCB0aGF0IGNoYW5nZXMgYmFzZWQgb24gdGhlIGFtb3VudCBvZiBtaW50aW5nIGZlZSIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUJwWkQwaWRtbHpkV0ZzSWlCMmFXVjNRbTk0UFNJd0lEQWdOVEF3SURVd01DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJZ2VHMXNibk02ZUd4cGJtczlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1RrdmVHeHBibXNpSUhabGNuTnBiMjQ5SWpFdU1TSStQSEpsWTNRZ2VEMGlNQ0lnZVQwaU1DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlHWnBiR3c5SWlObVptWm1abVlpUGp3dmNtVmpkRDQ4WnlCMGNtRnVjMlp2Y20wOUluUnlZVzV6YkdGMFpTZ3lNakl1TkRRNU16WXlOVGN6TkRnNU1qZ2dNakF4TGpFMU1Ua3lPRGsyTVRVMk9UUTNLU0krUEhCaGRHZ2daRDBpVFRFd09TNHhJQzA0TTBNeE5UQXVOeUF0TmpjdU5DQXlNREF1TkNBdE16TXVOeUF5TURJZ01TNDJRekl3TXk0M0lETTNJREUxTnk0eklEYzBJREV4TlM0M0lERXhNeTR6UXpjMElERTFNaTQzSURNM0lERTVOQzR6SURBdU55QXhPVE11TmtNdE16VXVOaUF4T1RJdU9TQXROekV1TWlBeE5Ea3VPQ0F0T1RrdU5TQXhNVEF1TlVNdE1USTNMamdnTnpFdU1pQXRNVFE0TGprZ016VXVOaUF0TVRRMkxqZ2dNaTR4UXkweE5EUXVOeUF0TXpFdU15QXRNVEU1TGpRZ0xUWXlMamNnTFRreElDMDNPQzR6UXkwMk1pNDNJQzA1TkNBdE16RXVNeUF0T1RNdU9TQXhMaklnTFRrMVF6TXpMamNnTFRrMkxqSWdOamN1TkNBdE9UZ3VOeUF4TURrdU1TQXRPRE1pSUdacGJHdzlJaU5HUTBGR00wTWlQand2Y0dGMGFENDhMMmMrUEM5emRtYysifQ=="
const redShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU2hhcGUgU1ZHICMwIiwgImRlc2NyaXB0aW9uIjogIkFuIE5GVCB0aGF0IGNoYW5nZXMgYmFzZWQgb24gdGhlIGFtb3VudCBvZiBtaW50aW5nIGZlZSIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUJwWkQwaWRtbHpkV0ZzSWlCMmFXVjNRbTk0UFNJd0lEQWdOVEF3SURVd01DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJZ2VHMXNibk02ZUd4cGJtczlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1RrdmVHeHBibXNpSUhabGNuTnBiMjQ5SWpFdU1TSStQSEpsWTNRZ2VEMGlNQ0lnZVQwaU1DSWdkMmxrZEdnOUlqVXdNQ0lnYUdWcFoyaDBQU0kxTURBaUlHWnBiR3c5SWlObVptWm1abVlpUGp3dmNtVmpkRDQ4WnlCMGNtRnVjMlp2Y20wOUluUnlZVzV6YkdGMFpTZ3pNREl1TnpVM05ESTNORE16TVRRMk5qTWdNalk1TGpnMU1qazBNREU1TkRrek56Y3BJajQ4Y0dGMGFDQmtQU0pOTnpVdU5TQXRPVGt1TjBNNE5TNDVJQzAyTlM0eElEYzBMaklnTFRNeUxqVWdOelF1TVNBdE1DNHhRemMwSURNeUxqTWdPRFV1TkNBMk5DNDJJRGMxSURnNUxqZEROalF1TmlBeE1UUXVPU0F6TWk0eklERXpNeUE0TGpVZ01USTBMalZETFRFMUxqTWdNVEUySUMwek1DNDJJRGd4SUMwM01pNHpJRFUxTGpoRExURXhOQ0F6TUM0MklDMHhPRElnTVRVdU15QXRNVGcxTGpJZ0xUTXVNa010TVRnNExqUWdMVEl4TGpjZ0xURXlOaTQzSUMwME15NDBJQzA0TlNBdE56aERMVFF6TGpRZ0xURXhNaTQzSUMweU1TNDNJQzB4TmpBdU5DQTFMalFnTFRFMk5TNDRRek15TGpVZ0xURTNNUzR5SURZMUxqRWdMVEV6TkM0MElEYzFMalVnTFRrNUxqY2lJR1pwYkd3OUlpTkdSakF3TmpZaVBqd3ZjR0YwYUQ0OEwyYytQQzl6ZG1jKyJ9"

const svgShapes = [blueShapeSVG, greenShapeSVG, orangeShapeSVG, redShapeSVG];
const base64Shapes = [blueShapeBase64, greenShapeBase64, orangeShapeBase64, redShapeBase64];
const tokenUris = [blueShapeTokenUri, greenShapeTokenUri, orangeShapeTokenUri, redShapeTokenUri];

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Dynamic Shape SVG NFT Unit Tests", function () {
        let dynamicSvgNft, deployer, mintFee;

        beforeEach(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0];
            await deployments.fixture(["mocks", "dynamicSvgNft"]);
            dynamicSvgNft = await ethers.getContract("DynamicSvgNft");
            mintFee = await dynamicSvgNft.getMintFee();
        });

        describe("constructor", () => {
            it("sets SVG shapes correctly", async function () {
                const blueShapeSVGFromCall = await dynamicSvgNft.getSvgShape(0);
                const greenShapeSVGFromCall = await dynamicSvgNft.getSvgShape(1);
                const orangeShapeSVGFromCall = await dynamicSvgNft.getSvgShape(2);
                const redShapeSVGFromCall = await dynamicSvgNft.getSvgShape(3);

                expect(blueShapeSVGFromCall).to.eq(blueShapeSVG);
                expect(greenShapeSVGFromCall).to.eq(greenShapeSVG);
                expect(orangeShapeSVGFromCall).to.eq(orangeShapeSVG);
                expect(redShapeSVGFromCall).to.eq(redShapeSVG);
            });

            it("sets Base64 shapes correctly", async function () {
                const blueShapeBase64FromCall = await dynamicSvgNft.getBase64Shape(0);
                const greenShapeBase64FromCall = await dynamicSvgNft.getBase64Shape(1);
                const orangeShapeBase64FromCall = await dynamicSvgNft.getBase64Shape(2);
                const redShapeBase64FromCall = await dynamicSvgNft.getBase64Shape(3);

                expect(blueShapeBase64FromCall).to.eq(blueShapeBase64);
                expect(greenShapeBase64FromCall).to.eq(greenShapeBase64);
                expect(orangeShapeBase64FromCall).to.eq(orangeShapeBase64);
                expect(redShapeBase64FromCall).to.eq(redShapeBase64);
            });

            it("sets SVG shapes count correctly", async function () {
                const shapesCount = await dynamicSvgNft.getSvgShapesCount();

                expect(shapesCount).to.eq(4);
            });
        });

        describe("requestNftMint", () => {
            context("when not enough amount sent", () => {
                it("reverts transaction", async function () {
                    await expect(
                        dynamicSvgNft.requestNftMint()
                    ).to.be.revertedWith("DynamicSvgNft__NotEnougthAmount");
                });
            });

            context("when enough amount sent", () => {
                it("emits NftMintRequested event", async function () {
                    await expect(
                        dynamicSvgNft.requestNftMint({ value: mintFee })
                    ).to.emit(dynamicSvgNft, "NftMintRequested");
                });

                it("emits a VRF requestId", async () => {
                    const txResponse = await dynamicSvgNft.requestNftMint({ value: mintFee })
                    const txReceipt = await txResponse.wait(1);
                    const requestId = txReceipt.events[1].args.requestId;

                    expect(requestId.toNumber()).to.be.greaterThan(0);
                });
            });
        });

        describe("fulfillRandomWords", function () {
            let requestId;

            beforeEach(async () => {
                const txResponse = await dynamicSvgNft.requestNftMint({ value: mintFee });
                const txReceipt = await txResponse.wait(1);
                requestId = txReceipt.events[1].args.requestId;
            });

            it("mints NFT after random number is returned", async function () {
                await new Promise(async (resolve, reject) => {
                    dynamicSvgNft.once("NftMinted", async () => {
                        try {
                            const tokenCounter = await dynamicSvgNft.getTokenCounter();

                            expect(tokenCounter).to.eq("1");

                            const tokenURI = await dynamicSvgNft.tokenURI(0);

                            expect(tokenUris).to.include.members([tokenURI]);

                            resolve();
                        } catch (e) {
                            console.log(e);
                            reject(e);
                        }
                    })
                    try {
                        const txResponse = await dynamicSvgNft.requestNftMint({ value: mintFee });
                        const txReceipt = await txResponse.wait(1);
                        const requestId = txReceipt.events[1].args.requestId;

                        await vrfCoordinatorV2Mock.fulfillRandomWords(
                            requestId,
                            dynamicSvgNft.address
                        );
                    } catch (e) {
                        console.log(e)
                        reject(e)
                    }
                })
            })
        });

        describe("svgToBase64", () => {
            svgShapes.forEach(function (value, i) {
                it(`returns Base64 generated from SVG for ${i + 1} shape`, async function () {
                    const svgToBase64 = await dynamicSvgNft.svgToBase64(value);

                    expect(svgToBase64).to.eq(base64Shapes[i]);
                });
            });
        });

        describe("generateTokenURI", () => {
            context("when token ID exists", () => {
                let tokenURI;

                beforeEach(async () => {
                    const txResponse = await dynamicSvgNft.requestNftMint({ value: mintFee });
                    const txReceipt = await txResponse.wait(1);
                    const requestId = txReceipt.events[1].args.requestId;
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, dynamicSvgNft.address);
                });

                base64Shapes.forEach(function (value, i) {
                    it(`returns generated tokenURI for ${i + 1} shape`, async function () {
                        tokenURI = await dynamicSvgNft.generateTokenURI("0", value);

                        expect(tokenURI).to.eq(tokenUris[i]);
                    });
                });
            });

            context("when token ID is not exist", () => {
                it("reverts transaction", async function () {
                    await expect(
                        dynamicSvgNft.generateTokenURI("0", blueShapeBase64)
                    ).to.be.revertedWith("ERC721Metadata__TokenNotExist");
                });
            });
        });

        describe("getMintFee", () => {
            it("returns mintFee value", async function () {
                const mintFeeFromCall = await dynamicSvgNft.getMintFee();

                expect(mintFeeFromCall).to.eq(mintFee);
            });
        });
    });
