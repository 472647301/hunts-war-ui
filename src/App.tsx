import React from "react";
import { Form, Input, Button, PageHeader } from "antd";

class App extends React.Component {
  public onStart = () => {
    if (window.robotHunt) {
      window.robotHunt.start("");
    }
  };

  public onLogs = (text: string) => {
    console.log("--onLogs--", text);
  };

  public onInit = (config: string) => {
    console.log("--onInit--", config);
  };

  public componentDidMount() {
    if (window.robotHunt) {
      window.robotHunt.init = this.onInit;
      window.robotHunt.logs = this.onLogs;
    }
  }

  public render() {
    return (
      <div className="app">
        <PageHeader
          title=""
          extra={[
            <Button key="help">使用说明</Button>,
            <Button key="start" type="primary" onClick={this.onStart}>
              启动
            </Button>,
          ]}
        />
        <Form layout="vertical">
          <Form.Item label="龙之谷安装目录">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="竞技场图标坐标">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="狩猎大战匹配坐标">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="狩猎大战开始坐标">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="狩猎大战投降坐标">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="狩猎大战结束坐标">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="角色头像坐标">
            <Input placeholder="input placeholder" />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default App;

declare global {
  interface Window {
    robotHunt: IRobotHunt;
  }
}
type IRobotHunt = {
  readonly start: (optinos: string) => void;
  readonly end: () => void;
  logs?: (text: string) => void;
  init?: (config: string) => void;
};
