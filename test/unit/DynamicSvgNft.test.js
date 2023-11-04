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

const blueShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU1ZHIE5GVCAjMCIsICJkZXNjcmlwdGlvbiI6ICJEeW5hbWljIG9uLWNoYWluIFNWRyBORlQiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCcFpEMGlkbWx6ZFdGc0lpQjJhV1YzUW05NFBTSXdJREFnTlRBd0lEVXdNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIWmxjbk5wYjI0OUlqRXVNU0krUEhKbFkzUWdlRDBpTUNJZ2VUMGlNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJR1pwYkd3OUlpTm1abVptWm1ZaVBqd3ZjbVZqZEQ0OFp5QjBjbUZ1YzJadmNtMDlJblJ5WVc1emJHRjBaU2d5TmpJdU5ETTBOVFF6T0RVMU9ETTBOellnTVRrMExqUXdORFkxTURnM016UTNPVE1wSWo0OGNHRjBhQ0JrUFNKTk1qa3VOaUF0TVRjdU0wTTBNaTQ1SUMwMkxqa2dOakV1TkNBMUxqY2dOelV1TkNBME5pNDFRemc1TGpVZ09EY3VNaUE1T1NBeE5UWXVNaUEyT1M0NUlERTROUzQ1UXpRd0xqZ2dNakUxTGpZZ0xUSTJMamtnTWpBMklDMDFNUzQySURFM01FTXROell1TkNBeE16UWdMVFU0TGpJZ056RXVOaUF0TmprZ01UY3VOa010TnprdU9DQXRNell1TXlBdE1URTVMamNnTFRneExqZ2dMVEV4TXlBdE9UQXVOa010TVRBMkxqTWdMVGs1TGpVZ0xUVXpMaklnTFRjeExqY2dMVEl5TGpVZ0xUVXpMamhET0M0eElDMHpOUzQ0SURFMkxqTWdMVEkzTGpjZ01qa3VOaUF0TVRjdU15SWdabWxzYkQwaUl6QXdOalpHUmlJK1BDOXdZWFJvUGp3dlp6NDhMM04yWno0PSJ9";
const greenShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU1ZHIE5GVCAjMCIsICJkZXNjcmlwdGlvbiI6ICJEeW5hbWljIG9uLWNoYWluIFNWRyBORlQiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCcFpEMGlkbWx6ZFdGc0lpQjJhV1YzUW05NFBTSXdJREFnTlRBd0lEVXdNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIWmxjbk5wYjI0OUlqRXVNU0krUEhKbFkzUWdlRDBpTUNJZ2VUMGlNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJR1pwYkd3OUlpTm1abVptWm1ZaVBqd3ZjbVZqZEQ0OFp5QjBjbUZ1YzJadmNtMDlJblJ5WVc1emJHRjBaU2d6TURVdU5qZzNPVEEyTnpJMk1ETXlOaUF4TnpRdU9EVXpNVGcwT1RjNU1qRXpOQ2tpUGp4d1lYUm9JR1E5SWsweU9TNDRJQzB5T0M0MFF6TTNJQzAwTGpjZ05EQXVNU0F4TUM0eUlETTBMalVnTmpVdU5VTXlPQzQ1SURFeU1DNDRJREUwTGpRZ01qRTJMamNnTFRJNExqRWdNak15TGpsRExUY3dMamNnTWpRNUxqSWdMVEUwTVM0MUlERTROUzQ0SUMweE5EZ3VNaUF4TWprdU9FTXRNVFUxSURjekxqZ2dMVGszTGprZ01qVXVNaUF0TmpJdU5TQXRNVFF1TjBNdE1qY3VNU0F0TlRRdU55QXRNVE11TmlBdE9EVXVPQ0F0TVM0eElDMDROUzR5UXpFeExqTWdMVGcwTGpVZ01qSXVOaUF0TlRJZ01qa3VPQ0F0TWpndU5DSWdabWxzYkQwaUl6QXdPVFEzTXlJK1BDOXdZWFJvUGp3dlp6NDhMM04yWno0PSJ9"
const orangeShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU1ZHIE5GVCAjMCIsICJkZXNjcmlwdGlvbiI6ICJEeW5hbWljIG9uLWNoYWluIFNWRyBORlQiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCcFpEMGlkbWx6ZFdGc0lpQjJhV1YzUW05NFBTSXdJREFnTlRBd0lEVXdNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIWmxjbk5wYjI0OUlqRXVNU0krUEhKbFkzUWdlRDBpTUNJZ2VUMGlNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJR1pwYkd3OUlpTm1abVptWm1ZaVBqd3ZjbVZqZEQ0OFp5QjBjbUZ1YzJadmNtMDlJblJ5WVc1emJHRjBaU2d5TWpJdU5EUTVNell5TlRjek5EZzVNamdnTWpBeExqRTFNVGt5T0RrMk1UVTJPVFEzS1NJK1BIQmhkR2dnWkQwaVRURXdPUzR4SUMwNE0wTXhOVEF1TnlBdE5qY3VOQ0F5TURBdU5DQXRNek11TnlBeU1ESWdNUzQyUXpJd015NDNJRE0zSURFMU55NHpJRGMwSURFeE5TNDNJREV4TXk0elF6YzBJREUxTWk0M0lETTNJREU1TkM0eklEQXVOeUF4T1RNdU5rTXRNelV1TmlBeE9USXVPU0F0TnpFdU1pQXhORGt1T0NBdE9Ua3VOU0F4TVRBdU5VTXRNVEkzTGpnZ056RXVNaUF0TVRRNExqa2dNelV1TmlBdE1UUTJMamdnTWk0eFF5MHhORFF1TnlBdE16RXVNeUF0TVRFNUxqUWdMVFl5TGpjZ0xUa3hJQzAzT0M0elF5MDJNaTQzSUMwNU5DQXRNekV1TXlBdE9UTXVPU0F4TGpJZ0xUazFRek16TGpjZ0xUazJMaklnTmpjdU5DQXRPVGd1TnlBeE1Ea3VNU0F0T0RNaUlHWnBiR3c5SWlOR1EwRkdNME1pUGp3dmNHRjBhRDQ4TDJjK1BDOXpkbWMrIn0="
const redShapeTokenUri = "data:application/json;base64,eyJuYW1lIjogIkR5bmFtaWMgU1ZHIE5GVCAjMCIsICJkZXNjcmlwdGlvbiI6ICJEeW5hbWljIG9uLWNoYWluIFNWRyBORlQiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCcFpEMGlkbWx6ZFdGc0lpQjJhV1YzUW05NFBTSXdJREFnTlRBd0lEVXdNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIWmxjbk5wYjI0OUlqRXVNU0krUEhKbFkzUWdlRDBpTUNJZ2VUMGlNQ0lnZDJsa2RHZzlJalV3TUNJZ2FHVnBaMmgwUFNJMU1EQWlJR1pwYkd3OUlpTm1abVptWm1ZaVBqd3ZjbVZqZEQ0OFp5QjBjbUZ1YzJadmNtMDlJblJ5WVc1emJHRjBaU2d6TURJdU56VTNOREkzTkRNek1UUTJOak1nTWpZNUxqZzFNamswTURFNU5Ea3pOemNwSWo0OGNHRjBhQ0JrUFNKTk56VXVOU0F0T1RrdU4wTTROUzQ1SUMwMk5TNHhJRGMwTGpJZ0xUTXlMalVnTnpRdU1TQXRNQzR4UXpjMElETXlMak1nT0RVdU5DQTJOQzQySURjMUlEZzVMamRETmpRdU5pQXhNVFF1T1NBek1pNHpJREV6TXlBNExqVWdNVEkwTGpWRExURTFMak1nTVRFMklDMHpNQzQySURneElDMDNNaTR6SURVMUxqaERMVEV4TkNBek1DNDJJQzB4T0RJZ01UVXVNeUF0TVRnMUxqSWdMVE11TWtNdE1UZzRMalFnTFRJeExqY2dMVEV5Tmk0M0lDMDBNeTQwSUMwNE5TQXROemhETFRRekxqUWdMVEV4TWk0M0lDMHlNUzQzSUMweE5qQXVOQ0ExTGpRZ0xURTJOUzQ0UXpNeUxqVWdMVEUzTVM0eUlEWTFMakVnTFRFek5DNDBJRGMxTGpVZ0xUazVMamNpSUdacGJHdzlJaU5HUmpBd05qWWlQand2Y0dGMGFENDhMMmMrUEM5emRtYysifQ=="

const svgShapes = [blueShapeSVG, greenShapeSVG, orangeShapeSVG, redShapeSVG];
const base64Shapes = [blueShapeBase64, greenShapeBase64, orangeShapeBase64, redShapeBase64];
const tokenUris = [blueShapeTokenUri, greenShapeTokenUri, orangeShapeTokenUri, redShapeTokenUri];

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Dynamic Shape SVG NFT Unit Tests", function () {
        let dynamicSvgNft, vrfCoordinatorV2Mock, deployer, mintFee;

        beforeEach(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0];
            await deployments.fixture(["mocks", "dynamicSvgNft"]);
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
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
                    });
                    try {
                        const txResponse = await dynamicSvgNft.requestNftMint({ value: mintFee });
                        const txReceipt = await txResponse.wait(1);
                        const requestId = txReceipt.events[1].args.requestId;

                        await vrfCoordinatorV2Mock.fulfillRandomWords(
                            requestId,
                            dynamicSvgNft.address
                        );
                    } catch (e) {
                        console.log(e);
                        reject(e);
                    }
                });
            });
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
