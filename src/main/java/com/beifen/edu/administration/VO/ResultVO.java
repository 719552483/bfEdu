package com.beifen.edu.administration.VO;


import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResultVO<T> {

    public static Integer SUCCESS_CODE = 200;
    public static Integer FAILED_CODE = 500;
    public static Integer APPROVAL_FAILED = 501;

    private Integer code;
    private String msg;
    private T data;

    public ResultVO() {

    }

    public ResultVO(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public ResultVO(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    /**
     * 请求成功  状态码 200
     *
     * @param msg 返回信息
     * @param <T> 类型
     * @return ResultVO
     */
    public static <T> ResultVO setSuccess(String msg) {
        return new ResultVO(200, msg);
    }

    /**
     * 请求成功  状态码 200
     *
     * @param msg  返回信息
     * @param data 返回对象
     * @param <T>  类型set
     * @return ResultVO
     */
    public static <T> ResultVO setSuccess(String msg, T data) {
        return new ResultVO(200, msg, data);
    }

    /**
     * 请求失败   状态码 500
     *
     * @param msg 返回信息
     * @param <T> 类型
     * @return ResultVO
     */
    public static <T> ResultVO setFailed(String msg) {
        return new ResultVO(500, msg);
    }

    public static <T> ResultVO setDateFailed(String msg) {
        return new ResultVO(204, msg);
    }

    /**
     * 请求失败  状态 500
     *
     * @param msg  返回信息
     * @param data 返回数据
     * @param <T>  类型
     * @return ResultVO
     */
    public static <T> ResultVO setFailed(String msg, T data) {
        return new ResultVO(500, msg, data);
    }

    /**
     * 审批发起失败  状态 501
     *
     * @param msg  返回信息
     * @param data 返回数据
     * @param <T>  类型
     * @return ResultVO
     */
    public static <T> ResultVO setApprovalFailed(String msg, T data) {
        return new ResultVO(501, msg, data);
    }

    /**
     * 审批发起失败  状态 501
     *
     * @param msg  返回信息
     * @param <T>  类型
     * @return ResultVO
     */
    public static <T> ResultVO setApprovalFailed(String msg) {
        return new ResultVO(501, msg);
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
