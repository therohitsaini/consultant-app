public static function OrderCreateForCourse($course_id, $customer_id, $shop_id)
    {
        try {
            $product_id = Course::where('shop_id', $shop_id)->where('id', $course_id)->first(['product_id']);
 
            // Check if course exists
            if (!$product_id) {
                return response()->json(['error' => 'Course not found'], 404);
            }
 
            $product_detail = GetProductDetailFromGraphQL($product_id['product_id'], $shop_id);
 
            if (!$product_detail || !isset($product_detail['variants']['edges'][0]['node']['price'])) {
                \Log::error('Failed to get product details or price', [
                    'product_id' => $product_id['product_id'],
                    'shop_id' => $shop_id,
                    'product_detail' => $product_detail
                ]);
                return null;
            }
 
            $product_price = $product_detail['variants']['edges'][0]['node']['price'];
 
            $shopify = CreateShopifyObject($shop_id);
 
            if (!$shopify) {
                \Log::error('Failed to create Shopify object', ['shop_id' => $shop_id]);
                return null;
            }
 
            if (!empty($customer_id)) {
                $query = '
                    mutation {
                        draftOrderCreate(input: {
                            customerId: "gid://shopify/Customer/' . $customer_id . '"
                            lineItems: [{
                                title: "' . $product_detail['title'] . '"
                                quantity: 1
                                originalUnitPrice: ' . $product_price . '
                                customAttributes: [
                                    {
                                        key: "course_id"
                                        value: "' . $course_id . '"
                                    },
                                    {
                                        key: "customer_id"
                                        value: "' . $customer_id . '"
                                    },
                                    {
                                        key: "shop_id"
                                        value: "' . $shop_id . '"
                                    },
                                    {
                                        key: "product_id"
                                        value: "' . preg_replace('/\D/', '', $product_id['product_id']) . '"
                                    }
                                ]
                            }]
                        }) {
                            draftOrder
                            {
                                id
                                invoiceUrl
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }';
 
                $response = $shopify->GraphQL->post($query);
 
                \Log::alert('GraphQL Response: ' . json_encode($response));
 
                // Check for errors first
                if (isset($response['errors'])) {
                    \Log::alert('GraphQL Errors: ' . json_encode($response['errors']));
                    return null;
                }
 
                // Check for user errors
                if (isset($response['data']['draftOrderCreate']['userErrors']) &&
                    !empty($response['data']['draftOrderCreate']['userErrors'])) {
                    \Log::alert('User Errors: ' . json_encode($response['data']['draftOrderCreate']['userErrors']));
                    return null;
                }
 
                // Check if draft order was created successfully
                if (isset($response['data']['draftOrderCreate']['draftOrder']['invoiceUrl'])) {
                    $invoiceUrl = $response['data']['draftOrderCreate']['draftOrder']['invoiceUrl'];
                    \Log::alert('Invoice URL: ' . $invoiceUrl);
                    return $invoiceUrl;
                }
 
                \Log::alert('No invoice URL found in response');
                return null;
            }
 
            return null;
        } catch (\Exception $e) {
            \Log::alert($e->getMessage() . $e->getFile() . $e->getLine() . " in CreateRechargeDraftOrder function");
            return null;
        }
    }
 