<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('systemUser.account')" prop="account">
                <el-input v-model="form.account" :disabled="isEdit" :placeholder="$t('systemRole.lengthCheck', { min: 5, max: 15 })"></el-input>
            </el-form-item>
            <el-form-item :label="$t('systemRole.role')" prop="roles">
                <el-select v-model="form.roles" multiple :placeholder="$t('pleaseSelect')" size="small">
                    <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('systemRole.password')" prop="password" :key="updateType">
                <el-input
                    v-model="form.password"
                    type="password"
                    :placeholder="$t('systemRole.lengthCheck', { min: 6, max: 20 }) + (updateType === 'edit' ? '(' + $t('systemRole.passwordChange') + ')' : '')"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('systemRole.confirmPassword')" prop="repeatPassword" :key="updateType">
                <el-input v-model="form.repeatPassword" type="password" :placeholder="$t('systemRole.lengthCheck', { min: 6, max: 20 })"></el-input>
            </el-form-item>

            <el-form-item :label="$t('systemRole.bindPhone')" prop="phone">
                <el-input v-model="form.phone">
                    <template #prepend>
                        <el-select v-model="form.phonePrefix" filterable style="width:80px">
                            <el-option v-for="item in phonePrefixList" :key="item.phonePrefix" :label="item.phonePrefix" :value="item.phonePrefix"> </el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('systemRole.code')" prop="code">
                <el-input v-model="form.code">
                    <template #append>
                        <el-button @click="handleCountDown" :disabled="countDownSecond !== 60">
                            {{ countDownSecond !== 60 ? `(${countDownSecond}S)` : "" }}
                            {{ $t("systemRole.getCode") }}
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>

            <!-- 状态 -->
            <el-form-item :label="$t('status.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in forbiddenEnable" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('remark')" prop="remark">
                <el-input v-model="form.remark" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { userSave, userUpdate, roleFind } from "@/api/system";
import { basePhonePrefix, getPhoneCode } from "@/api/user";
import { adminSellerCheckAccount } from "@/api/goods";
export default {
    name: "systemRole",
    components: {},
    props: {
        visible: Boolean,
        row: Object,
        isEdit: Boolean
    },
    emits: ["reloadData", "initEdit"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let updateType = computed(() => (JSON.stringify(props.row) == "{}" ? "add" : "edit"));

        //状态
        const forbiddenEnable = computed(() => {
            return [
                {
                    name: proxy.$t("status.enable"),
                    value: 0
                },
                {
                    name: proxy.$t("status.forbidden"),
                    value: 1
                }
            ];
        });

        let validatePass = (rule, value, callback) => {
            if (value !== form.value.password) {
                callback(new Error(proxy.$t("systemRole.twoPassword")));
            } else {
                callback();
            }
        };

        let form = ref({
            phone: "",
            phonePrefix: proxy.$store.state.app.phonePrefix,
            status: "",
            remark: ""
        });

        watch(
            () => props.row,
            (nVal) => {
                let roles = [];
                if (props.row.roles) {
                    roles = props.row.roles.map((item) => item.roleId);
                }
                form.value = {
                    ...props.row,
                    password: props.row.password || "",
                    repeatPassword: props.row.repeatPassword || "",
                    phonePrefix: props.row.phonePrefix || proxy.$store.state.app.phonePrefix,
                    roles: roles,
                    remark: props.row.remark,
                    status: props.row.status
                };

                //密码检验
                if (updateType.value === "add") {
                    rules.password = [
                        { required: true, message: proxy.$t("required"), trigger: "blur" },
                        {
                            min: 6,
                            max: 20,
                            message: proxy.$t("systemRole.lengthCheck", { min: 6, max: 20 }),
                            trigger: "blur"
                        }
                    ];
                    rules.repeatPassword = [
                        { required: true, message: proxy.$t("required"), trigger: "blur" },
                        { validator: validatePass, trigger: "blur" }
                    ];
                } else {
                    rules.password = "";
                    rules.repeatPassword = { validator: validatePass, trigger: "blur" };
                }
            }
        );

        // 账户校验
        const validatepUser = (rule, value, callback) => {
            if (value.length >= 5 && value.length <= 15 && /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)) {
                adminSellerCheckAccount({ account: value })
                    .then((res) => {
                        callback();
                    })
                    .catch((err) => {
                        callback(new Error(err.data.msg));
                    });
            } else {
                callback(new Error(proxy.$t("register.accountFormat")));
                return;
            }
        };

        const rules = {
            account: [
                { validator: validatepUser, trigger: "change" },
                {
                    required: true,
                    min: 5,
                    max: 15,
                    message: proxy.$t("systemRole.lengthCheck", { min: 5, max: 15 }),
                    trigger: "change"
                }
            ],
            status: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" },
            roles: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }
        };

        //获取角色列表
        let roleList = ref([]);
        const getRoleList = () => {
            roleFind()
                .then((res) => {
                    roleList.value = res.data.records;
                })
                .catch((err) => {});
        };
        getRoleList();

        //获取手机前缀
        let phonePrefixList = ref([]);
        const getBasePhonePrefix = () => {
            basePhonePrefix(0)
                .then((res) => {
                    phonePrefixList.value = res.data;
                })
                .catch((err) => {});
        };
        getBasePhonePrefix();

        //倒计时
        let countDownTimer = null;
        let countDownSecond = ref(60);
        const handleCountDown = (data) => {
            if (form.value.phone === "") {
                proxy.$message.error(proxy.$t("systemRole.phoneRegex"));
                return;
            }
            const TIME_COUNT = countDownSecond.value;
            if (!countDownTimer) {
                const loading = proxy.$loading({
                    background: "rgba(255,255,255,.2)"
                });
                const params = {
                    phone: form.value.phone,
                    phonePrefix: form.value.phonePrefix,
                    type: 1,
                    userType: "seller"
                };
                getPhoneCode(params)
                    .then((res) => {
                        form.value.code = res.data;
                        countDownTimer = setInterval(() => {
                            if (countDownSecond.value > 0 && countDownSecond.value <= TIME_COUNT) {
                                countDownSecond.value--;
                            } else {
                                clearInterval(countDownTimer);
                                countDownTimer = null;
                                countDownSecond.value = 60;
                            }
                        }, 1000);

                        loading.close();
                    })
                    .catch((err) => {
                        loading.close();
                    });
            }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    let type = userUpdate;
                    if (updateType.value === "add") {
                        type = userSave;
                    }
                    type(form.value)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                            clearInterval(countDownTimer);
                            countDownSecond.value = 60;
                            isCountdown.value = false;
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            emit("initEdit");
            emit("update:visible", false);
        };

        return {
            updateType,
            forbiddenEnable,
            form,
            rules,
            formRef,
            roleList,
            phonePrefixList,
            countDownSecond,
            handleCountDown,
            confirm,
            cancel
        };
    }
};
</script>
