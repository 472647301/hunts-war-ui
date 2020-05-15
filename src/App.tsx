import React from "react";
import { Row, Col, PageHeader } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Card } from "antd";
import { Empty, message, Modal } from "antd";
import Cookies from "js-cookie";

const OPTIONS: Array<ItemT> = [
  "DN_INSTALL_DIR",
  "JJC_ICON_LOCATION",
  "HUNT_MATCH_LOCATION",
  "HUNT_START_LOCATION",
  "HUNT_SURRENDDER_LOCATION",
  "HUNT_STOP_LOCATION",
  "CHARACTER_HEAD_COORDINATE",
  "ESC_SURRENDDER_LOCATION",
  "DROP_NOTICE_QQ",
  "OTHER",
];
class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    const Optinos: Partial<IState> = {};
    OPTIONS.forEach((key) => {
      const val = Cookies.get(key);
      Optinos[key] = val;
    });
    this.state = {
      logs: [],
      runState: false,
      DN_INSTALL_DIR: Optinos.DN_INSTALL_DIR || "",
      JJC_ICON_LOCATION: Optinos.JJC_ICON_LOCATION || "",
      HUNT_MATCH_LOCATION: Optinos.HUNT_MATCH_LOCATION || "",
      HUNT_START_LOCATION: Optinos.HUNT_START_LOCATION || "",
      HUNT_SURRENDDER_LOCATION: Optinos.HUNT_SURRENDDER_LOCATION || "",
      HUNT_STOP_LOCATION: Optinos.HUNT_STOP_LOCATION || "",
      CHARACTER_HEAD_COORDINATE: Optinos.CHARACTER_HEAD_COORDINATE || "",
      ESC_SURRENDDER_LOCATION: Optinos.ESC_SURRENDDER_LOCATION || "",
      DROP_NOTICE_QQ: Optinos.DROP_NOTICE_QQ || "",
      OTHER: Optinos.OTHER || "",
      visible: false,
    };
  }

  public onSubmit = () => {
    if (!window.NativeNotice) {
      return;
    }
    // 启动
    if (!this.state.runState) {
      this.submitStart();
      return;
    }
    // 停止
    Modal.confirm({
      centered: true,
      title: "您确定要停止脚本嘛?",
      icon: <ExclamationCircleOutlined />,
      content: "停止脚本将导致狩猎机器人退出当前工作",
      cancelText: "我在想想",
      okText: "确认停止",
      onOk() {
        window.NativeNotice.send("hunt-stop");
      },
    });
  };

  public submitStart = () => {
    if (!window.NativeNotice) {
      return;
    }
    const { DN_INSTALL_DIR } = this.state;
    const { JJC_ICON_LOCATION } = this.state;
    const { HUNT_MATCH_LOCATION } = this.state;
    const { HUNT_START_LOCATION } = this.state;
    const { HUNT_SURRENDDER_LOCATION } = this.state;
    const { HUNT_STOP_LOCATION } = this.state;
    const { CHARACTER_HEAD_COORDINATE } = this.state;
    const { ESC_SURRENDDER_LOCATION } = this.state;
    if (!DN_INSTALL_DIR) {
      message.warning("请输入龙之谷安装目录");
      return;
    }
    if (!JJC_ICON_LOCATION || !this.paramValid(JJC_ICON_LOCATION)) {
      message.warning("请输入正确的竞技场图标坐标");
      return;
    }
    if (!HUNT_MATCH_LOCATION || !this.paramValid(HUNT_MATCH_LOCATION)) {
      message.warning("请输入正确的狩猎大战匹配坐标");
      return;
    }
    if (!HUNT_START_LOCATION || !this.paramValid(HUNT_START_LOCATION)) {
      message.warning("请输入正确的狩猎大战开始坐标");
      return;
    }
    if (
      !HUNT_SURRENDDER_LOCATION ||
      !this.paramValid(HUNT_SURRENDDER_LOCATION)
    ) {
      message.warning("请输入正确的狩猎大战投降坐标");
      return;
    }
    if (!HUNT_STOP_LOCATION || !this.paramValid(HUNT_STOP_LOCATION)) {
      message.warning("请输入正确的狩猎大战结束坐标");
      return;
    }
    if (
      !CHARACTER_HEAD_COORDINATE ||
      !this.paramValid(CHARACTER_HEAD_COORDINATE)
    ) {
      message.warning("请输入正确的角色头像中心坐标");
      return;
    }
    if (ESC_SURRENDDER_LOCATION && !this.paramValid(ESC_SURRENDDER_LOCATION)) {
      message.warning("请输入正确的Esc投降坐标");
      return;
    }
    window.NativeNotice.send("hunt-start", {
      DN_INSTALL_DIR: DN_INSTALL_DIR,
      JJC_ICON_LOCATION: JSON.parse(JJC_ICON_LOCATION),
      HUNT_MATCH_LOCATION: JSON.parse(HUNT_MATCH_LOCATION),
      HUNT_START_LOCATION: JSON.parse(HUNT_START_LOCATION),
      HUNT_SURRENDDER_LOCATION: JSON.parse(HUNT_SURRENDDER_LOCATION),
      HUNT_STOP_LOCATION: JSON.parse(HUNT_STOP_LOCATION),
      CHARACTER_HEAD_COORDINATE: JSON.parse(CHARACTER_HEAD_COORDINATE),
      ESC_SURRENDDER_LOCATION: ESC_SURRENDDER_LOCATION
        ? JSON.parse(ESC_SURRENDDER_LOCATION)
        : "",
      DROP_NOTICE_QQ: this.state.DROP_NOTICE_QQ,
      OTHER: this.state.OTHER,
    });
  };

  public paramValid(param: string) {
    try {
      const data = JSON.parse(param);
      if (data && data.x && data.y) {
        return typeof data.x === "number" && typeof data.y === "number";
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  public onHelp = () => {
    this.setState({ visible: true });
  };

  public onInit = (config: Array<string>) => {
    console.log("--onInit--", config);
  };

  public onLogs = (text: string) => {
    if (!text) {
      return;
    }
    const list = this.state.logs;
    list.unshift(text);
    this.setState({ logs: list });
  };

  public onStart = () => {
    message.success("脚本已成功启动");
    this.setState({ runState: true });
    OPTIONS.forEach((key) => {
      Cookies.set(key, this.state[key], { expires: 365 });
    });
  };

  public onStop = () => {
    this.setState({ runState: false });
  };

  public onVisible = () => {
    this.setState({ visible: false });
  };

  public onlineDocument = () => {
    if (window.NativeNotice) {
      window.NativeNotice.send(
        "open-url",
        "https://www.jianshu.com/p/738a8cb88809"
      );
    }
  };

  public componentDidMount() {
    if (window.NativeNotice) {
      window.NativeNotice.on("hunt-init", this.onInit);
      window.NativeNotice.on("hunt-logs", this.onLogs);
      window.NativeNotice.on("hunt-start", this.onStart);
      window.NativeNotice.on("hunt-stop", this.onStop);
    }
  }

  public render() {
    const { logs, runState } = this.state;
    return (
      <div className="app">
        <PageHeader
          title=""
          extra={[
            <Button key="help" onClick={this.onHelp}>
              帮助/更新
            </Button>,
            <Button
              key="start"
              type={"primary"}
              danger={runState}
              onClick={this.onSubmit}
            >
              {runState ? "停止脚本" : "启动脚本"}
            </Button>,
          ]}
        />
        <Row>
          <Col span={11}>
            <Form layout="vertical">
              <Form.Item label="龙之谷安装目录">
                <Input
                  placeholder="input placeholder"
                  value={this.state.DN_INSTALL_DIR}
                  onChange={(e) => {
                    this.setState({ DN_INSTALL_DIR: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item label="竞技场图标坐标">
                <Input
                  placeholder="input placeholder"
                  value={this.state.JJC_ICON_LOCATION}
                  onChange={(e) => {
                    this.setState({ JJC_ICON_LOCATION: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item label="狩猎大战匹配坐标">
                <Input
                  placeholder="input placeholder"
                  value={this.state.HUNT_MATCH_LOCATION}
                  onChange={(e) => {
                    this.setState({ HUNT_MATCH_LOCATION: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item label="狩猎大战开始坐标">
                <Input
                  placeholder="input placeholder"
                  value={this.state.HUNT_START_LOCATION}
                  onChange={(e) => {
                    this.setState({ HUNT_START_LOCATION: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item label="狩猎大战投降坐标">
                <Input
                  placeholder="input placeholder"
                  value={this.state.HUNT_SURRENDDER_LOCATION}
                  onChange={(e) => {
                    this.setState({ HUNT_SURRENDDER_LOCATION: e.target.value });
                  }}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={2} />
          <Col span={11}>
            <Form layout="vertical">
              <Form.Item label="狩猎大战结束坐标">
                <Input
                  placeholder="input placeholder"
                  value={this.state.HUNT_STOP_LOCATION}
                  onChange={(e) => {
                    this.setState({ HUNT_STOP_LOCATION: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item label="角色头像中心坐标">
                <Input
                  placeholder="input placeholder"
                  value={this.state.CHARACTER_HEAD_COORDINATE}
                  onChange={(e) => {
                    this.setState({
                      CHARACTER_HEAD_COORDINATE: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="Esc投降坐标">
                <Input
                  placeholder="input placeholder"
                  value={this.state.ESC_SURRENDDER_LOCATION}
                  onChange={(e) => {
                    this.setState({ ESC_SURRENDDER_LOCATION: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item label="掉线通知QQ">
                <Input
                  placeholder="input placeholder"
                  value={this.state.DROP_NOTICE_QQ}
                  onChange={(e) => {
                    this.setState({ DROP_NOTICE_QQ: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item label="其它">
                <Input
                  placeholder="input placeholder"
                  value={this.state.OTHER}
                  onChange={(e) => {
                    this.setState({ OTHER: e.target.value });
                  }}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Card size="small" title="操作记录">
          <div className="footer">
            {logs.length ? (
              logs.map((e, i) => {
                return (
                  <p key={"log-" + i} className="footer-text">
                    {e}
                  </p>
                );
              })
            ) : (
              <Empty description="暂无记录" />
            )}
          </div>
        </Card>
        <Modal
          title="帮助/更新"
          visible={this.state.visible}
          onCancel={this.onVisible}
          onOk={this.onVisible}
        >
          <p className="help-text">
            <span className="help-desc" onClick={this.onlineDocument}>
              查看在线文档
            </span>
          </p>
          <p className="help-text">进群咨询，QQ群：296884495</p>
        </Modal>
      </div>
    );
  }
}

export default App;

declare global {
  interface Window {
    NativeNotice: INativeNotice;
  }
}
type INativeNotice = {
  on: (channel: string, callback: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
};
type ItemT = keyof Omit<IState, "logs" | "runState" | "visible">;
type IState = {
  logs: Array<string>;
  runState: boolean;
  /**
   * 龙之谷安装目录
   */
  DN_INSTALL_DIR: string;
  /**
   * 竞技场图标坐标
   */
  JJC_ICON_LOCATION: string;
  /**
   * 狩猎大战匹配坐标
   */
  HUNT_MATCH_LOCATION: string;
  /**
   * 狩猎大战开始坐标
   */
  HUNT_START_LOCATION: string;
  /**
   * 狩猎大战投降坐标
   */
  HUNT_SURRENDDER_LOCATION: string;
  /**
   * 狩猎大战结束坐标
   */
  HUNT_STOP_LOCATION: string;
  /**
   * 角色头像中心坐标
   */
  CHARACTER_HEAD_COORDINATE: string;
  /**
   * Esc投降坐标
   */
  ESC_SURRENDDER_LOCATION: string;
  /**
   * 掉线通知QQ
   */
  DROP_NOTICE_QQ: string;
  /**
   * 其它
   */
  OTHER: string;
  visible: boolean;
};
