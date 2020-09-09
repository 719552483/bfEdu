package com.beifen.edu.administration.controller;

import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.utility.RedisUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RedisController {

    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private RedisUtils redisUtils;

    @RequestMapping("/setIntoRedis")
    public String HelloSpring (String key,String value){
        redisTemplate.opsForValue().set(key,value);
        return "redis set成功！key="+key+"value="+value;
    }

    @RequestMapping("/getFromRedis")
    public ResultVO HelloSpring (@RequestParam("key") String key){
        ResultVO result;
        Object o = redisTemplate.opsForValue().get(key);
        result = ResultVO.setSuccess("获取成功",o);
        return result;
    }

    @RequestMapping("/getListFromRedis")
    public ResultVO getListFromRedis (@RequestParam("key") String key){
        ResultVO result;
        List<Object> objects = redisUtils.lGet(key,0,-1);
        result = ResultVO.setSuccess("获取成功",objects);
        return result;
    }
}
