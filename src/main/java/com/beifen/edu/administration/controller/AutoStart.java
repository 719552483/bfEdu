package com.beifen.edu.administration.controller;

import com.beifen.edu.administration.service.SystemManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


/**
 * 描述:项目启动,自动执行类
 */
@Component
public class AutoStart implements CommandLineRunner {

    @Autowired
    SystemManageService systemManageService;

    @Override
    public void run(String... strings) throws Exception {
        systemManageService.getSysInfo();
    }
}
