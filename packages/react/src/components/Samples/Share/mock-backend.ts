import mock, { proxy } from 'xhr-mock';

mock.setup();

// 修改用户 profile
mock.put(/.*\/api\/user\/profile/, (req, res) => {
  return res.status(200);
});

// 所有其他请求走真实网络
mock.use(proxy);
