export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">📚 API Documentation</h1>
          <p className="text-gray-600 mb-8">3DAIXS.COM Backend API</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">🔗 Base URL</h2>
              <code className="block bg-gray-100 p-3 rounded">http://localhost:5000/api</code>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">🔐 Authentication</h2>
              <div className="space-y-2">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">POST /auth/login</p>
                  <p className="text-sm text-gray-600">Login với username và password</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold">POST /auth/trial</p>
                  <p className="text-sm text-gray-600">Tạo tài khoản dùng thử 24h</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-semibold">GET /auth/me</p>
                  <p className="text-sm text-gray-600">Lấy thông tin user hiện tại</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">👥 Users</h2>
              <div className="space-y-2">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">GET /users</p>
                  <p className="text-sm text-gray-600">Lấy danh sách users (Admin)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">POST /users</p>
                  <p className="text-sm text-gray-600">Tạo user mới (Admin)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">📇 Contacts</h2>
              <div className="space-y-2">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold">GET /contacts</p>
                  <p className="text-sm text-gray-600">Lấy danh sách danh bạ</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold">POST /contacts</p>
                  <p className="text-sm text-gray-600">Tạo danh bạ mới</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">💬 Messages</h2>
              <div className="space-y-2">
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-semibold">POST /messages/parse</p>
                  <p className="text-sm text-gray-600">Parse tin nhắn cược (Preview)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-semibold">POST /messages</p>
                  <p className="text-sm text-gray-600">Lưu tin nhắn đã parse</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">🎰 Lottery</h2>
              <div className="space-y-2">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-semibold">GET /lottery/today</p>
                  <p className="text-sm text-gray-600">Kết quả hôm nay</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-semibold">GET /lottery/latest</p>
                  <p className="text-sm text-gray-600">7 kết quả gần nhất</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-semibold">POST /lottery/crawl</p>
                  <p className="text-sm text-gray-600">Crawl kết quả (Admin)</p>
                </div>
              </div>
            </section>

            <section className="mt-8 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">📖 Chi tiết đầy đủ:</h3>
              <p className="text-sm mb-2">Xem file: <code className="bg-white px-2 py-1 rounded">/opt/3daixs.com/TEST_API.md</code></p>
              <p className="text-sm">Tổng cộng: <strong>50+ endpoints</strong></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
