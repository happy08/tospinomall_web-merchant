<template>
    <div class="content-wrap  mb-25 p-25 bg-white round-4 mb-25">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="custom-tabs-green">
            <el-tab-pane label="基本信息" name="1">
                <div>
                    <BmBaseTitle title="基本信息"> </BmBaseTitle>
                </div>
                <el-form :model="baseInfoForm" label-width="150px" class=" mb-30" label-position="left">
                    <el-form-item label="账户名称:" prop="">
                        <div>{{ baseInfoForm.account }}</div>
                    </el-form-item>

                    <el-form-item label="登录密码:" prop="">
                        <div>
                            <span>{{ baseInfoForm.password }}</span
                            ><span class="ml-50 green cp" @click="editPane(2)">修改</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="绑定手机号码:" prop="">
                        <div>
                            <span>{{ baseInfoForm.phonePrefix }} {{ baseInfoForm.phone }}</span
                            ><span class="ml-50 green cp" @click="editPane(3)">修改</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="登录手机号码验证:" prop="">开启</el-form-item>

                    <el-form-item label="账户绑定邮件:" prop="">
                        <el-input v-model="editEmailForm.email" style="width: 480px;" placeholder="邮箱输入后,必须填写邮箱验证码"></el-input>
                    </el-form-item>

                    <el-form-item label="验证码:" prop="">
                        <el-input placeholder="请输入验证码" style="width: 480px;" v-model="editEmailForm.code">
                            <template #append>
                                <el-button type="info" @click="getEmailMessage">{{ isCountdown ? count.count + "s" : "获取验证码" }}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="flex vcenter"><el-button @click="subEditEmail" type="primary" style="200px;">确认修改</el-button></div>
            </el-tab-pane>

            <el-tab-pane label="登录密码" name="2">
                <div>
                    <BmBaseTitle title="登录密码"> </BmBaseTitle>
                </div>

                <el-form :model="passwdForm" ref="passwdFormRef" :rules="passwdFormRules" label-width="100px" class=" mb-30" label-position="left">
                    <el-form-item label="当前密码" prop="password">
                        <el-input style="width: 480px;" v-model="passwdForm.password" placeholder="" maxlength="20" type="password" show-word-limit show-password></el-input>
                    </el-form-item>

                    <el-form-item label="设置密码" prop="newPassword">
                        <el-input style="width: 480px;" v-model="passwdForm.newPassword" placeholder="" maxlength="20" type="password" show-word-limit show-password></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="repeatPassword">
                        <el-input style="width: 480px;" v-model="passwdForm.repeatPassword" placeholder="" maxlength="20" type="password" show-word-limit show-password></el-input>
                    </el-form-item>

                    <el-form-item label="手机号码" prop="">
                        <el-input placeholder="" v-model="baseInfoForm.phone" class="input-with-select" type="number" disabled style="width: 480px;">
                            <template #prepend>
                                <el-select disabled v-model="baseInfoForm.phonePrefix">
                                    <el-option label="+86" value="86"></el-option>
                                    <el-option label="+89" value="233"></el-option>
                                </el-select>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="验证码" prop="code">
                        <el-input placeholder="请输入验证码" v-model="passwdForm.code" style="width: 480px;">
                            <template #append>
                                <el-button type="info" @click="getPassWdPhoneCode">{{ isCountdown_2 ? count_2.count + "s" : "获取验证码" }}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="flex vcenter"><el-button @click="subPasswd" type="primary" style="200px;">确认修改</el-button></div>
            </el-tab-pane>

            <el-tab-pane label="手机号码" name="3">
                <div class="step">
                    <el-steps :active="active" class="custom-step mb-40" finish-status="success" style="width: 800px;">
                        <el-step title="原手机号码"></el-step>
                        <el-step title="修改手机号码"></el-step>
                        <el-step title="修改成功"></el-step>
                    </el-steps>
                </div>

                <div>
                    <BmBaseTitle title="手机号码"> </BmBaseTitle>
                </div>

                <div v-if="active != 2">
                    <el-form label-width="100px" class="mb-30" label-position="left">
                        <el-form-item label="当前绑定手机号">
                            <div>
                                <el-input style="width: 480px;" placeholder="请输入手机号" v-model="baseInfoForm.phone" class="input-with-select" type="number" disabled>
                                    <template #prepend>
                                        <el-select disabled v-model="baseInfoForm.phonePrefix">
                                            <el-option label="+86" value="86"></el-option>
                                            <el-option label="+89" value="233"></el-option>
                                        </el-select>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="验证码">
                            <div>
                                <el-input placeholder="请输入验证码" type="number" v-model="oldPhoneForm.code" style="width: 480px;">
                                    <template #append>
                                        <el-button type="info" class="btn-color" @click="getCurrentCode">{{ isCountdown_3 ? count_3.count + "s" : "获取验证码" }}</el-button>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="nextStep" class="subBtn" type="primary" style="width: 480px;">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div v-if="active == 2">
                    <el-form label-width="100px" class="mb-30" label-position="left">
                        <el-form-item label="新手机号">
                            <div>
                                <el-input style="width: 480px;" placeholder="请输入手机号" v-model="newPhoneForm.phone" class="input-with-select" type="number">
                                    <template #prepend>
                                        <el-select v-model="newPhoneForm.phonePrefix">
                                            <el-option label="+86" value="86"></el-option>
                                            <el-option label="+89" value="233"></el-option>
                                        </el-select>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="验证码">
                            <div>
                                <el-input placeholder="请输入验证码" type="number" v-model="newPhoneForm.code" style="width: 480px;">
                                    <template #append>
                                        <el-button type="info" class="btn-color" @click="getNewPhoneCode">{{ isCountdown_4 ? count_4.count + "s" : "获取验证码" }}</el-button>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="subEditPhone" class="subBtn" type="primary" style="width: 480px;">确认提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, onMounted, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
//       获取手机验证码, 获取当前登录人手机号验证码      校验当前登录人手机号             卖家web->修改卖家手机号码  查询当前登录卖家信息        获取邮箱验证码            修改邮箱            修改密码
import {
    getPhoneCode,
    adminGetCurrentPhoneCode,
    adminCheckCurrentPhoneOrEmail,
    adminSellerUpdatePhone,
    adminSellerFindCurrentInfo,
    adminCheckGetEmailCode,
    adminSellerUpdateEmail,
    adminSellerUpdatePassword
} from "@/api/user";
import { encrypt } from "@/utils/cryptoAES";
import storage from "@/utils/storage";
export default {
    name: "modificationUPI",
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();

        let user_info = {};

        let active = ref(1);

        onMounted(() => {
            user_info = computed(() => store.state.user.userInfo);
        });

        let activeName = ref("1");

        let timer = null;
        let count = reactive({ count: 60 });
        const isCountdown = ref(false);

        let editEmailForm = reactive({
            email: "",
            userType: "seller",
            type: "3",
            code: ""
        });

        const getEmailMessage = () => {
            if (isCountdown.value) {
                return;
            }

            if (editEmailForm.email.length < 6) {
                proxy.$message.error("您的邮箱格式不对");
                return;
            }

            isCountdown.value = true;

            timer = setInterval(() => {
                console.log(count.count);
                count.count--;
                if (count.count > 0) {
                    count.count = count.count--;
                } else {
                    clearInterval(timer);
                    (count.count = 60), (isCountdown.value = false);
                }
            }, 1000);

            // 发送请求
            adminCheckGetEmailCode(editEmailForm).then((res) => {
                console.log(res);
                editEmailForm.code = res.data;
            });
        };

        // 修改邮箱
        const subEditEmail = () => {
            adminSellerUpdateEmail(editEmailForm).then((res) => {
                proxy.$message.success(res.msg);
                store.dispatch("user/LogOut");
                router.push(`/login`);
            });
        };

        // tab切换
        const handleClick = (tab, event) => {
            console.log(tab.props.name);
            // pane = tab.props.name;
            // getListPage();
            // searchCount();
        };

        // 收到切换pane
        const editPane = (val) => {
            if (val == 2) {
                activeName.value = "2";
            } else {
                activeName.value = "3";
            }
        };

        let baseInfoForm = ref({});

        // 获取用户信息
        const getCurrentInfo = () => {
            adminSellerFindCurrentInfo().then((res) => {
                baseInfoForm.value = res.data;
            });
        };
        getCurrentInfo();

        // -------------------------登录密码---------------------------
        let passwdForm = reactive({
            password: "",
            newPassword: "",
            repeatPassword: "",
            code: "",
            phone: "",
            phonePrefix: ""
        });

        let passwdFormRef = ref(null);

        const validatepPhoneCode = (rule, value, callback) => {
            if (value !== passwdForm.newPassword) {
                callback(new Error("两次输入的密码不一致"));
            } else {
                callback();
            }
        };

        let passwdFormRules = {
            password: [
                { required: true, message: "请输入密码", trigger: "blur" },
                { min: 6, message: "密码不能小于6位", trigger: "blur" }
            ],
            newPassword: [
                { required: true, message: "请输入密码", trigger: "blur" },
                { min: 6, message: "密码不能小于6位", trigger: "blur" }
            ],
            repeatPassword: [{ validator: validatepPhoneCode, trigger: "blur" }],
            code: [
                { required: true, message: "请输入验证码", trigger: "blur" },
                { min: 6, message: "验证码不能小于6位", trigger: "change" }
            ]
        };

        let timer_2 = null;
        let count_2 = reactive({ count: 60 });
        const isCountdown_2 = ref(false);

        const getPassWdPhoneCode = () => {
            if (isCountdown_2.value) {
                return;
            }

            // if( passwdForm.emaillAddress.length < 6 ) {
            //     proxy.$message.error('您的邮箱格式不对');
            //     return
            // }

            isCountdown_2.value = true;

            timer_2 = setInterval(() => {
                console.log(count_2.count);
                count_2.count--;
                if (count_2.count > 0) {
                    count_2.count = count_2.count--;
                } else {
                    clearInterval(timer_2);
                    (count_2.count = 60), (isCountdown_2.value = false);
                }
            }, 1000);

            let data = { type: "1", userType: "seller" };
            // 发送请求
            adminGetCurrentPhoneCode(data).then((res) => {
                console.log(res);
                passwdForm.code = res.data;
            });
        };

        // 修改密码
        const subPasswd = () => {
            let form = {
                password: encrypt(passwdForm.password),
                newPassword: encrypt(passwdForm.newPassword),
                repeatPassword: encrypt(passwdForm.repeatPassword),
                code: passwdForm.code
            };
            passwdFormRef.value.validate((valid) => {
                if (valid) {
                    adminSellerUpdatePassword(form).then((res) => {
                        proxy.$message.success(res.msg);
                        store.dispatch("user/LogOut");
                        router.push(`/login`);
                    });
                } else {
                    console.log("error submit");
                    return false;
                }
            });
        };

        // ----------------------手机号码-----------------------
        const oldPhoneForm = reactive({
            userType: "seller", // 用户类型，seller卖家，buyer买家，operator运营
            type: "1", // 校验类型，1：手机号码，2：邮箱
            code: "",
            phone: user_info.phone,
            phonePrefix: user_info.phonePrefix
        });

        // 获取当前已经登录用户的验证码
        let timer_3 = null;
        let count_3 = reactive({ count: 60 });
        const isCountdown_3 = ref(false);

        const getCurrentCode = () => {
            if (isCountdown_3.value) {
                return;
            }

            isCountdown_3.value = true;

            timer_3 = setInterval(() => {
                console.log(count_3.count);
                count_3.count--;
                if (count_3.count > 0) {
                    count_3.count = count_3.count--;
                } else {
                    clearInterval(timer_3);
                    (count_3.count = 60), (isCountdown_3.value = false);
                }
            }, 1000);

            // 发送请求
            let data = { type: "1", userType: "seller" };
            // 发送请求
            adminGetCurrentPhoneCode(data).then((res) => {
                console.log(res);
                oldPhoneForm.code = res.data;
            });
        };

        // 下一步 校验验证码
        const nextStep = () => {
            // 校验当前登录用户手机号码或者邮箱
            adminCheckCurrentPhoneOrEmail(oldPhoneForm).then((res) => {
                active.value = 2;
            });
        };

        // 获取验证码
        let timer_4 = null;
        let count_4 = reactive({ count: 60 });
        const isCountdown_4 = ref(false);

        let newPhoneForm = reactive({
            phone: "",
            phonePrefix: "86",
            type: "0",
            code: "",
            userType: "seller"
        });

        const getNewPhoneCode = () => {
            if (isCountdown_4.value) {
                return;
            }

            if (newPhoneForm.phone.length < 6) {
                proxy.$message.error("您的手机号格式不对");
                return;
            }

            isCountdown_4.value = true;

            timer_4 = setInterval(() => {
                console.log(count_4.count);
                count_4.count--;
                if (count_4.count > 0) {
                    count_4.count = count_4.count--;
                } else {
                    clearInterval(timer_4);
                    (count_4.count = 60), (isCountdown_4.value = false);
                }
            }, 1000);

            // 发送请求
            getPhoneCode(newPhoneForm).then((res) => {
                console.log(res);
                newPhoneForm.code = res.data;
            });
        };

        // 提交
        const subEditPhone = () => {
            adminSellerUpdatePhone(newPhoneForm).then((res) => {
                proxy.$message.success(res.msg);
                store.dispatch("user/LogOut");
                router.push(`/login`);
            });
        };

        return {
            active,
            activeName,
            handleClick,
            count,
            isCountdown,
            getEmailMessage,
            editEmailForm,
            subEditEmail,
            baseInfoForm,
            passwdForm,
            getPassWdPhoneCode,
            count_2,
            isCountdown_2,
            count_3,
            isCountdown_3,
            count_4,
            isCountdown_4,
            subPasswd,
            oldPhoneForm,
            nextStep,
            subEditPhone,
            getCurrentCode,
            getNewPhoneCode,
            newPhoneForm,
            editPane,
            passwdFormRules,
            passwdFormRef
        };
    }
};
</script>

<style lang="scss" scoped>
.content-wrap {
    .step {
        width: 100%;
        margin-bottom: 90px;
        padding-top: 20px;
    }
}
/deep/ .el-input-group__prepend {
    width: 110px;
}
/deep/.el-select .el-input {
    width: 100px;
}
/deep/.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>
