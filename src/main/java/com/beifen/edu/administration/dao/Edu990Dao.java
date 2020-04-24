package com.beifen.edu.administration.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu000;
import com.beifen.edu.administration.domian.Edu990;

public interface Edu990Dao extends JpaRepository<Edu990, Long>,JpaSpecificationExecutor<Edu990> {

	//查询用户是否存在
	@Query(value = "select * from edu990 b where b.yhm=?1", nativeQuery = true)
	public String checkIsHaveUser(String userName);
	
	//查询密码是否正确
	@Query(value = "select b.mm from edu990 b where b.yhm=?1", nativeQuery = true)
	public String checkPwd(String userName);
	
	@Query(value = "select * from edu990 b where b.yhm=?1", nativeQuery = true)
	public Edu990 getUserInfo(String userName);
	
	
}
